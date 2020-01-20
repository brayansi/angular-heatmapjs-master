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
            -22.542375726527336,
            -45.768957285705596
        ], [
            -22.541206446271943,
            -45.76666131478885
        ], [
            -22.545467335077834,
            -45.76440825921634
        ], [
            -22.542375726527336,
            -45.768957285705596
        ]]

        // add color tarvos
        plotty.addColorScale(
            "heatMap",
            ['#ffffff', '#ffffff', '#ffffff', '#FF6F00', '#FFEA00', '#FFEA00', '#FFEA00', '#FF6F00', '#FF0000'],
            [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1]
        )

        // map
        var mymap = L.map('mapid');

        mymap.fitBounds(myPolygon, { padding: [0, 0] });

        let bounds = mymap.getBounds();

        let bounds1 = L.latLngBounds([
            -22.542375726527336,
            -45.768957285705596
        ], [
            -22.541206446271943,
            -45.76666131478885
        ], [
            -22.545467335077834,
            -45.76440825921634
        ], [
            -22.542375726527336,
            -45.768957285705596
        ]);
        

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="http://mapbox.com">Mapbox</a>',
            id: 'mapbox.streets'
        }).addTo(mymap);

        var windSpeed = L.leafletGeotiff(
            'https://tillteste.s3.amazonaws.com/wind_speed.tif',
            {
                band: 0,
                bounds: [[-22.545467335077834,-45.768957285705596],[-22.541206446271943,-45.76440825921634]],
                displayMin: 0,
                displayMax: 10,
                name: 'Wind speed',
                colorScale: 'heatMap',
                clampLow: false,
                clampHigh: true,
            }
        ).addTo(mymap);

        var polygon = L.polygon(myPolygon, { color: 'red' }).addTo(mymap);

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