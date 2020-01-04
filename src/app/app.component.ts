import { Component, OnInit, Renderer2 } from '@angular/core';

declare let L: any;
declare let plotty: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
    speed: any = null
    direction: any = null

    ngOnInit(): void {

        //latLng
        var marker;

        //poligon latLng
        var myPolygon = [[
            -30.259067203213018, 147.94189453125003
        ], [
            -28.902397228558485, 150.64453125000003
        ], [
            -32.93492866908232, 153.61083984375003
        ], [
            -30.259067203213018, 147.94189453125003
        ]]

        // add color tarvos
        plotty.addColorScale(
            "heatMap",
            ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#FFEA00', '#FFEA00', '#FFEA00', '#FF6F00', '#FF0000'],
            [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1]
        )
        
        // map
        var mymap = L.map('mapid');
        mymap.fitBounds(myPolygon);

        // L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        //     maxZoom: 18,
        //     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        //         '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        //         'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        //     id: 'mapbox.streets'
        // }).addTo(mymap);

        var windSpeed = L.leafletGeotiff(
            'https://tillteste.s3.amazonaws.com/wind_speed.tif',
            {
                band: 0,
                displayMin: 0,
                displayMax: 30,
                name: 'Wind speed',
                colorScale: 'heatMap',
                clampLow: false,
                clampHigh: true,
                arrowSize: 20,
            }
        ).addTo(mymap);

        windSpeed.setClip(myPolygon);

        document.getElementById('colorScaleImage').setAttribute('src', windSpeed.colorScaleData);

        mymap.on('click', (e) => {
            if (!marker) {
                marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(mymap);
            } else {
                marker.setLatLng([e.latlng.lat, e.latlng.lng]);
            }

            this.speed = windSpeed.getValueAtLatLng(e.latlng.lat, e.latlng.lng)
        });
    }
}