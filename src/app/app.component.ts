import { Component, OnInit, Renderer2 } from '@angular/core';

declare let h337: any;

const HEATMAP_HEIGHT = 400;
const HEATMAP_WIDTH = 400;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    gradientCfg = {
        '0.15': '#6ad180', // green
        '0.25': '#7cd573',
        '0.35': '#90d865',
        '0.45': '#a4da57',
        '0.55': '#badc48',
        '0.65': '#c9cf35',
        '0.75': '#d6c226',
        '0.80': '#e2b41c',
        '0.85': '#e2961d',
        '0.90': '#dd7826',
        '0.95': '#d25c30',
        '1.0': '#c24039' // highest red
    };
    heatmap: any = null;
    coordinates: Array<Coordinate> = []
    heatmapContainer: HTMLElement;

    xMinCoord: number;
    yMinCoord: number;
    xMaxCoord: number;
    yMaxCoord: number;

    constructor(private renderer: Renderer2) { }

    ngOnInit(): void {

        // INIT SVG
        this.init();

        this.generateCoordinates();

        const heatmapConfig = {
            container: document.querySelector('#heatmapContainer'),
            opacity: 0.8,
            radius: 15,
            blur: 1,
            visible: true,
            gradient: this.gradientCfg,
            backgroundColor: 'inherit'
        };
        this.heatmap = h337.create(heatmapConfig);
        this.heatmap.setData({ data: this.coordinates });

        this.heatmapContainer = document.querySelector('#heatmapContainer');

    }

    generateCoordinates(): void {
        const extremas = [(Math.random() * 20) >> 0, (Math.random() * 20) >> 0];
        const max = Math.max.apply(Math, extremas);
        const min = Math.min.apply(Math, extremas);

        var heatmap = [{
            x: 0,
            y: 0
        }, {
            x: 400,
            y: 176
        }, {
            x: 80,
            y: 312
        }, {
            x: 30,
            y: 200
        }]

        for (let i = 0; i < 4; i++) {
            const x = heatmap[i].x;
            const y = heatmap[i].y;
            const c = ((Math.random() * max - min) >> 0) + min;
            // add to dataset
            this.coordinates.push({ x: x, y: y, value: c });
        }
    }


    // SVG

    latLng2point(latLng) {
        return {
            x: (latLng.lng + 180) * (256 / 360),
            y: (256 / 2) - (256 * Math.log(Math.tan((Math.PI / 4) + ((latLng.lat * Math.PI / 180) / 2))) / (2 * Math.PI))
        };
    }

    poly_gm2svg(gmPaths, fx) {

        var point,
            gmPath,
            svgPath,
            svgPaths = [],
            minX = 256,
            minY = 256,
            maxX = 0,
            maxY = 0;

        svgPath = [];
        for (var p = 0; p < gmPaths.length; ++p) {
            point = this.latLng2point(fx(gmPaths[p]));
            minX = Math.min(minX, point.x);
            minY = Math.min(minY, point.y);
            maxX = Math.max(maxX, point.x);
            maxY = Math.max(maxY, point.y);
            svgPath.push([point.x, point.y].join(','));
        }


        svgPaths.push(svgPath.join(' '))

        return {
            path: 'M' + svgPaths.join('z M') + 'z',
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };

    }

    drawPoly(node, props) {

        var svg = node.cloneNode(false),
            g = document.createElementNS("http://www.w3.org/2000/svg", 'g'),
            path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        node.parentNode.replaceChild(svg, node);
        path.setAttribute('d', props.path);
        g.appendChild(path);
        svg.appendChild(g);
        svg.setAttribute('viewBox', [props.x, props.y, props.width, props.height].join(' '));


    }

    init() {

        var myPolygon = [{
            lat: -22.546008762001478,
            lng: -45.77286258203128
        }, {
            lat: -22.548703943404004,
            lng: -45.766253619018585
        }, {
            lat: -22.550804562994625,
            lng: -45.77153220635989
        }, {
            lat: -22.54910028917061,
            lng: -45.77234759790042
        }]

        var svgProps = this.poly_gm2svg(myPolygon, function (latLng) {
            return {
                lat: latLng.lat,
                lng: latLng.lng
            }
        });

        this.drawPoly(document.getElementById('svg'), svgProps)
    }
}

export interface Coordinate {
    x: number;
    y: number;
    value: number;
}
