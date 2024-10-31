import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  ViewChild,
  Input, effect, OnInit, inject, Signal, computed, OnDestroy
} from '@angular/core';
import * as d3 from 'd3';
import {ApplicationStore} from "../../stores/application.store";
import {ApplicationHistory} from "../../interfaces/Application.history.interface";
import {PhaseStore} from "../../stores/phase.store";
import {Phase} from "../../interfaces/phase";
import {SpinnerComponent} from "../common/spinner.component";
import {toTitleCase} from "../../utilities/textFormatter.utility";

@Component({
  selector: 'app-application-lifecycle-visualization',
  standalone: true,
  imports: [
    SpinnerComponent,
  ],
  styles: `
    .svg-content-responsive {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  `,
  template: `
    <div class="relative">
      <h2 class="absolute bg-white rounded-br-xl pr-1 text-xl font-bold mb-2 select-none">Application Lifecycle</h2>
      <div #visualizationContainer class="w-full">
        @if (applicationHistoryError() || phasesError()) {
          <div
            class="absolute w-full h-full content-center text-center">
            <div class="text-2xl text-gray-500">Error loading data</div>
          </div>
        } @else if (!applicationHistory() || !phases()) {
          <div
            class="absolute w-full h-full content-center text-center">
            <app-spinner/>
          </div>
        }
      </div>
    </div>
  `
})
export class ApplicationLifecycleVisualizationComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('visualizationContainer') visualizationElement!: ElementRef;
  @Input() applicationId!: string;

  readonly applicationHistory: Signal<ApplicationHistory[] | null> = inject(ApplicationStore).applicationHistory;
  readonly applicationHistoryError: Signal<Error | null> = inject(ApplicationStore).applicationHistoryError;
  readonly fetchApplicationHistory: (applicationUuid: string) => void = inject(ApplicationStore).fetchApplicationHistory;
  readonly phases: Signal<Phase[]> = inject(PhaseStore).phases;
  readonly phasesError: Signal<Error | null> = inject(PhaseStore).phasesError;
  private visualization: d3.Selection<SVGSVGElement, unknown, null, undefined> | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private lastResizeWidth = 0;
  private lastResizeHeight = 0;

  private visualizationSettings: VisualizationSettings = {
    minZoomScale: 0.1,
    maxZoomScale: 2,
    heading: 'Application Lifecycle',
    headingMargin: 1,
    width: 400,
    height: 210,
    margin: 50,
    backgroundColor: "rgb(255,255,255)",
    currentPhaseColor: "rgb(128,196,0)",
    previousPhaseColor: "rgb(0,144,220)",
    yOffset: 20,
    circleRadius: 10,
    circleStrokeWidth: 2,
    circleLineColor: "rgb(128,128,128)",
    circleFillColor: "rgb(85,120,195)",
    lineAngle: 35, // Degrees
    lineColor: "rgb(196,196,196)",
    lineStrokeWidth: 2,
    lineStrokeDashArray: "5, 3",
    dateLocale: 'en-GB',
    dateFormatOptions: {day: "numeric", month: "short", year: "numeric"},
    legendScale: 1,
    legendGap: 3,
    legendMargin: 2,
    legendLineColor: "rgb(128,128,128)",
    legendStrokeWidth: 1,
  }

  private legendData: LegendDataItem[] = [
    {color: this.visualizationSettings.currentPhaseColor, label: 'Current Phase'},
    {color: this.visualizationSettings.previousPhaseColor, label: 'Previous Phases'},
    {color: this.visualizationSettings.backgroundColor, label: 'Future Phases'}
  ];

  visualizationInitialized = false;

  constructor(private ngZone: NgZone) {
  }

  ngOnInit() {
    if (!this.applicationHistory()) {
      this.fetchApplicationHistory(this.applicationId);
    }
  }

  ngAfterViewInit(): void {
    this.ngZone.run(() => {
      this.generateVisualization();
      this.visualizationInitialized = true;
      this.resizeObserver = new ResizeObserver(() => this.onResize());
      this.resizeObserver.observe(this.visualizationElement.nativeElement);
      this.onResize();
    });
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  onResize(): void {
    if (!this.visualization) return;
    const container = this.visualizationElement.nativeElement;
    const width = container.clientWidth;
    let height = container.clientHeight < 550 ? container.clientHeight : 550;
    this.updateLegendPosition();
    this.updateButtonGroupPosition();
    this.lastResizeWidth = width;
    this.lastResizeHeight = height;
    this.visualization.attr('viewBox', `0 0 ${width} ${height}`);
  }

  updateLegendPosition(): void {
    if (!this.visualization) return;
    const legendGroup = this.visualization.select(".legend-group");
    const viewBox = this.visualization.attr('viewBox').split(' ');
    let viewBoxWidth = parseFloat(viewBox[2]);
    let viewBoxHeight = parseFloat(viewBox[3]);
    const legendHeight = this.calculateLegendHeight();
    legendGroup.attr("transform", `translate(${0}, ${viewBoxHeight - legendHeight})`);
  }

  updateButtonGroupPosition(): void {
    if (!this.visualization) return;
    const buttonGroup = this.visualization.select(".button-group");
    const viewBox = this.visualization.attr('viewBox').split(' ');
    let viewBoxWidth = parseFloat(viewBox[2]);
    let viewBoxHeight = parseFloat(viewBox[3]);
    buttonGroup.attr("transform", `translate(${viewBoxWidth - 31}, ${viewBoxHeight - 31})`);
  }

  calculateLegendHeight(): number {
    return ((2 * this.visualizationSettings.lineStrokeWidth) +
      (2 * this.visualizationSettings.legendMargin) +
      (this.legendData.length * (2 * this.visualizationSettings.circleRadius * this.visualizationSettings.legendScale)) +
      ((this.legendData.length - 1) * this.visualizationSettings.legendGap));
  }

  reRenderVisualizationEffect = effect(() => {
    this.applicationHistory(); // Add dependency
    this.phases(); // Add dependency
    if (!this.visualizationInitialized) return;
    this.generateVisualization();
  });

  prepareVisualizationData(applicationHistory: ApplicationHistory[], phases: Phase[]): VisualizationDataItem[] {
    if (applicationHistory.length < 1 || phases.length < 1) return [];
    const phaseMap = new Map<string, string>();
    phases.forEach(phase => phaseMap.set(phase.uuid || '', phase.name || ''));

    let orderedPhases = phases.sort((a, b) => {return ((a.order_number || -1) < (b.order_number || -1)) ? -1 : 1;});

    let orderedHistory = applicationHistory.sort((a, b) => {
      return new Date(a.operation_timestamp) < new Date(b.operation_timestamp) ? -1 : 1;
    });

    let visualizationData = orderedHistory.map((history, index) => {
      return {
        index,
        phaseId: history.phase_uuid || '',
        phaseName: phaseMap.get(history.phase_uuid || '') || 'Unknown',
        date: history.operation_timestamp ? new Date(history.operation_timestamp) : null,
        currentPhase: index === orderedHistory.length - 1
      }
    });

    const lastPhaseId = visualizationData[visualizationData.length - 1].phaseId;
    const lastPhaseIndex = orderedPhases.findIndex(phase => phase.uuid === lastPhaseId);
    if (lastPhaseIndex < orderedPhases.length - 1) {
      for (let i = lastPhaseIndex + 1; i < phases.length; i++) {
        visualizationData.push({
          index: visualizationData.length,
          phaseId: orderedPhases[i].uuid || '',
          phaseName: orderedPhases[i].name || 'Unknown',
          date: null,
          currentPhase: false
        });
      }
    }
    return visualizationData;
  }

  private generateVisualization(): void {
    if (!this.visualization) {
      this.createVisualization(this.visualizationSettings);
    }
    let data = this.prepareVisualizationData(this.applicationHistory() || [], this.phases());
    this.populateVisualization(data, this.visualizationSettings, this.legendData);
  }

  private createVisualization(settings: VisualizationSettings): void {
    this.visualization = d3.select(this.visualizationElement.nativeElement)
      .append("svg")
      .classed("svg-content-responsive", true)
      .attr("viewBox", `0 0 ${settings.width} ${settings.height}`)
      .style("cursor", "move");

    this.makeVisualizationZoomable(this.visualization, settings);
  }

  private makeVisualizationZoomable(visualization: d3.Selection<SVGSVGElement, unknown, null, undefined>, settings: VisualizationSettings): void {
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([settings.minZoomScale, settings.maxZoomScale]) // Set the zoom scale extent
      .on("zoom", (event) => this.zoomed(event));
    visualization.call(zoom);
  }

  private centerVisualization(): void {
    if (!this.visualization) return;

    const visualizationGroup = this.visualization.select(".visualization-group");
    const svgElement = this.visualization.node() as SVGSVGElement;

    if (!visualizationGroup || !svgElement) return;

    const bbox = (visualizationGroup.node() as SVGGraphicsElement)?.getBBox();
    if (!bbox) return;

    const svgWidth = svgElement.clientWidth;
    const svgHeight = svgElement.clientHeight;

    const centerX = (svgWidth - bbox.width) / 2 - bbox.x;
    const centerY = (svgHeight - bbox.height) / 2 - bbox.y;

    const transform = d3.zoomIdentity.translate(centerX, centerY);
    visualizationGroup.attr("transform", transform.toString());

    this.visualization.call(d3.zoom<SVGSVGElement, unknown>().transform, transform);
  }

  private resetZoom(): void {
    if (!this.visualization) return;

    const visualizationGroup = this.visualization.select(".visualization-group");
    const svgElement = this.visualization.node() as SVGSVGElement;

    if (!visualizationGroup || !svgElement) return;

    const bbox = (visualizationGroup.node() as SVGGraphicsElement)?.getBBox();
    if (!bbox) return;

    const viewBox = svgElement.viewBox.baseVal;
    const scale = (viewBox.width * 0.8) / bbox.width;

    const transform = d3.zoomIdentity.scale(scale);
    visualizationGroup.attr('transform', transform.toString());

    this.visualization.call(d3.zoom<SVGSVGElement, unknown>().transform, transform);
  }

  private resetView(): void {
    if (!this.visualization) return;

    const visualizationGroup = this.visualization.select(".visualization-group");
    const svgElement = this.visualization.node() as SVGSVGElement;

    if (!visualizationGroup || !svgElement) return;

    const bbox = (visualizationGroup.node() as SVGGraphicsElement)?.getBBox();
    if (!bbox) return;

    const svgWidth = svgElement.clientWidth;
    const svgHeight = svgElement.clientHeight;

    const scale = (svgElement.viewBox.baseVal.width * 0.8) / bbox.width;
    const centerX = (svgWidth - bbox.width * scale) / 2 - bbox.x * scale;
    const centerY = (svgHeight - bbox.height * scale) / 2 - bbox.y * scale;

    const transform = d3.zoomIdentity.translate(centerX, centerY).scale(scale);
    visualizationGroup.attr("transform", transform.toString());

    this.visualization.call(d3.zoom<SVGSVGElement, unknown>().transform, transform);
  }

  private zoomed(event: d3.D3ZoomEvent<SVGSVGElement, unknown>): void {
    if (!this.visualization) return;
    this.visualization.selectAll(".visualization-group").attr('transform', event.transform.toString());
  }

  private populateVisualization(data: VisualizationDataItem[], settings: VisualizationSettings, legendData: LegendDataItem[] = []): void {
    if (!this.visualization) return;
    this.visualization.selectAll("*").remove();

    this.visualization.append("g").attr("class", "visualization-group");
    this.visualization.append("g").attr("class", "legend-group");
    this.visualization.append("g").attr("class", "button-group");

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.index)!])
      .range([settings.margin, settings.width - settings.margin]);

    const yMiddle = settings.height / 2;

    function offsetYPosition(index: number) {
      if (index % 2 === 0) {
        return yMiddle - settings.yOffset;
      } else {
        return yMiddle + settings.yOffset;
      }
    }

    const visualizationGroup = this.visualization.select(".visualization-group");

    visualizationGroup.selectAll("line")
      .data(data.slice(1))
      .enter()
      .append("line")
      .attr("x1", (d: any, i: number) => data[i].index.valueOf() * ((settings.yOffset*2)/Math.tan(settings.lineAngle * (Math.PI / 180))))
      .attr("y1", (d: any, i: number) => offsetYPosition(i))
      .attr("x2", (d: { index: d3.NumberValue; }) => d.index.valueOf() * ((settings.yOffset*2)/Math.tan(settings.lineAngle * (Math.PI / 180))))
      .attr("y2", (d: any, i: number) => offsetYPosition(i + 1))
      .attr("stroke", settings.lineColor)
      .attr("stroke-width", settings.lineStrokeWidth)
      .style("stroke-dasharray", (d: { date: Date | null }) => d.date ? "none" : settings.lineStrokeDashArray);

    visualizationGroup.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d: { index: d3.NumberValue; }) => d.index.valueOf() * ((settings.yOffset*2)/Math.tan(settings.lineAngle * (Math.PI / 180))))
      .attr("cy", (d: any, i: number) => offsetYPosition(i))
      .attr("r", settings.circleRadius)
      .style("stroke", settings.circleLineColor)
      .style("stroke-width", settings.circleStrokeWidth)
      .style("fill", (d: { date: Date | null, currentPhase: boolean }) => {
        if (d.currentPhase) {
          return settings.currentPhaseColor;
        }
        return d.date ? settings.previousPhaseColor : settings.backgroundColor
      })

    visualizationGroup.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", (d: { index: d3.NumberValue; }) => d.index.valueOf() * ((settings.yOffset*2)/Math.tan(settings.lineAngle * (Math.PI / 180))))
      .attr("text-anchor", "middle")
      .style("user-select", "none")
      .each(function (d, i: number) {
        const text = d3.select(this);
        const lines = [toTitleCase(d.phaseName), d.date ? new Date(d.date).toLocaleDateString('en-GB', {
          day: "numeric",
          month: "short",
          year: "numeric"
        }) : ''];
        lines.forEach((line, j) => {
          text.append("tspan")
            .attr("x", text.attr("x"))
            .attr("dy", j === 0 ? (i % 2 === 0 ? "-1.2em" : "1.2em") : "1.2em") // Adjust dy based on even/odd index
            .style("font-size", j === 0 ? "0.85em" : "0.65em")
            .text(line);
        });
        let circleYPosition = offsetYPosition(i);
        let yPosition = circleYPosition + (i % 2 === 0 ? -settings.circleRadius : settings.circleRadius); // Even index above, odd index below
        text.attr("y", yPosition);
      });

    function legendHeight() {
      return ((2 * settings.lineStrokeWidth) +
        (2 * settings.legendMargin) +
        (legendData.length * (2 * settings.circleRadius * settings.legendScale) +
          ((legendData.length - 1) * settings.legendGap * settings.legendScale)
        )
      )
    }

    const legendGroup = this.visualization.select(".legend-group")
      .attr("transform", `translate(${0}, ${settings.height - legendHeight()})`);


    legendGroup.selectAll('circle')
      .data(legendData)
      .enter()
      .append('circle')
      .attr('cx', settings.legendMargin + (settings.circleStrokeWidth * settings.legendScale) + (settings.circleRadius * settings.legendScale))
      .attr('cy', (d, i) => settings.legendMargin + (settings.circleRadius * settings.legendScale) + (i * (2 * settings.circleRadius * settings.legendScale)) + (i * settings.legendGap))
      .attr('r', (settings.circleRadius * settings.legendScale))
      .style('stroke', settings.circleLineColor)
      .style('stroke-width', settings.circleStrokeWidth * settings.legendScale)
      .style('fill', d => d.color);

    legendGroup.selectAll('text')
      .data(legendData)
      .enter()
      .append('text')
      .attr('x', settings.legendMargin + (settings.circleRadius * settings.legendScale) + (settings.legendGap) + (settings.circleRadius * settings.legendScale))
      .attr('y', (d, i) => settings.legendMargin + (settings.circleRadius * settings.legendScale) + (i * (2 * settings.circleRadius * settings.legendScale)) + (i * settings.legendGap))
      .style('alignment-baseline', 'middle')
      .style('font-size', `${1.5 * settings.circleRadius * settings.legendScale}px`)
      .style('user-select', 'none')
      .text(d => d.label);

    const legendBBox = (<SVGGraphicsElement>legendGroup.node())?.getBBox();

    if (legendBBox) {
      legendGroup.insert("rect", "circle")
        .attr("x", legendBBox.x - settings.legendMargin)
        .attr("y", legendBBox.y - settings.legendMargin)
        .attr("width", legendBBox.width + (2 * settings.legendMargin))
        .attr("height", legendBBox.height + (2 * settings.legendMargin))
        .style("fill", "none")
        .style("stroke", settings.legendLineColor)
        .style("stroke-width", settings.legendStrokeWidth);
    }

    const buttonGroup = this.visualization.select(".button-group")
      .attr("transform", `translate(${0}, ${settings.height - legendHeight()})`)
      .style("cursor", "pointer")
      .on("click", () => {
        this.resetView();
      });


    buttonGroup.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 30)
      .attr("height", 30)
      .attr("fill", settings.backgroundColor)
      .style("stroke", settings.circleLineColor)
      .style("stroke-width", settings.legendStrokeWidth);

    buttonGroup.append("svg")
      .attr("width", 30)
      .attr("height", 30)
      .attr("viewBox", "0 -960 960 960")
      .attr("fill", settings.circleLineColor)
      .append("path")
      .attr("d", "M440-40v-167l-44 43-56-56 140-140 140 140-56 56-44-43v167h-80ZM220-340l-56-56 43-44H40v-80h167l-43-44 56-56 140 140-140 140Zm520 0L600-480l140-140 56 56-43 44h167v80H753l43 44-56 56Zm-260-80q-25 0-42.5-17.5T420-480q0-25 17.5-42.5T480-540q25 0 42.5 17.5T540-480q0 25-17.5 42.5T480-420Zm0-180L340-740l56-56 44 43v-167h80v167l44-43 56 56-140 140Z");

    this.updateLegendPosition();
    this.updateButtonGroupPosition();
    this.resetView();
  }
}

interface VisualizationDataItem {
  index: number,
  phaseId: string,
  phaseName: string,
  date: Date | null,
  currentPhase: boolean
}

interface VisualizationSettings {
  minZoomScale: number,
  maxZoomScale: number,
  heading: string,
  headingMargin: number,
  width: number,
  height: number,
  margin: number,
  backgroundColor: string,
  currentPhaseColor: string,
  previousPhaseColor: string,
  yOffset: number,
  circleRadius: number,
  circleStrokeWidth: number,
  circleLineColor: string,
  circleFillColor: string,
  lineAngle: number,
  lineColor: string,
  lineStrokeWidth: number,
  lineStrokeDashArray: string
  dateLocale: string,
  dateFormatOptions: Intl.DateTimeFormatOptions,
  legendScale: number,
  legendGap: number,
  legendMargin: number,
  legendLineColor: string,
  legendStrokeWidth: number
}

interface LegendDataItem {
  color: string,
  label: string
}
