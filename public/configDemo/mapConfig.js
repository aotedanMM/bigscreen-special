window.EMAP_CONFIG = {
    "map": {
        "defaultExtent": {
            "zoom": 5,
            "maxZoom": 20,
            "minZoom": 0,
            "center": [116.390833, 39.904832],
            "projection": "EPSG:4326"
        }
    },
    "baseLayer": {
        "id": "tiandituLayer_vec",
        "title": "天地图矢量",
        "type": "group",
        "layers": [{
                "layers": "vec",
                "matrixSet": "c",
                "format": "tiles",
                "tileType": 102,
                "crossOrigin": "*",
                "url": "http://t0.tianditu.gov.cn/vec_c/wmts?tk=4f62e1d82bd46e2ff470b291c2260156",
                "projection": "EPSG:4326"
            },
            {
                "layers": "cta",
                "matrixSet": "c",
                "format": "tiles",
                "tileType": 102,
                "crossOrigin": "*",
                "url": "http://t0.tianditu.gov.cn/cta_c/wmts?tk=4f62e1d82bd46e2ff470b291c2260156",
                "projection": "EPSG:4326"
            }
        ]
    }
}