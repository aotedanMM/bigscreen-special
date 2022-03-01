const symbols = {
  '//position': 'IP定位图标',
  'position': {
    source:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAkCAYAAACe0YppAAAAAXNSR0IArs4c6QAABX9JREFUWAmtVmtsVEUUvrN3lz4olD6kAQoKJVrDH2wBFcIrIJiqJTFpDdEfok2M0ZL6gvggIEqIEVM0/NAYNCSN1hD5AWkiBgpK3cZIKi3YWmqxSlvoY9m+2Gd3r+eb7tnO3b27tMGTzMyZ8/rmzMyZe4U2NRKKmcorYs1QJiqviCdZ+yRryTEIRrXBmHUMgpEb9CDWTcyUPhEwB2Uw28MHzmTr964qtTnSnhI2vVBoYt5EZOOGFg61hQPeU6OdjSdb9m11kzxMTQVVeQnPAHIS6RgMo21p5WdpeY++WKU70l8n70zVMJYnh+FwwHNo4OyRT9u/2u0jPS8AwCbwWGAVVF958EJ+asHq45qwFcWCJJsLI3RxqP2X8pY963vILhQBNYGrwCbQ4g/OLpxZuPEnQxMLkoEk0gnN6Hb/Ub/+8r7N3VbguuIIYBs1Pb/stYy5aytOaUJ/QNFPkxWzU+5ZtEbzDH433HFxnJxNGQMIxNlK4EUl7+3UbPZpbe9EGHMvhH1FfvmHO0mKBBGbceSErWXGBTs+ybVnZFWx8G5HPT2ramnFRzkUh4FlSJ7wNttzHykrpXNNeHuNcX//UFPd3rbq8ifRwEOWeIFiTs6q7aWkR+lG8biOGVi3Z2SXJAoCgLaPS7e7mn68RTYoFW3Qebwnp2hLw4NvnfxW2FPmWvk60mXMGtIBWJYYGBAD24U+I+GFGmlrOEygyM5DbSzSPJBBR3Nrss8oJIWa8WTqpMAidKHb86y9Na3fWdtIOoDejmmeiM7SNRLTdMF4q+HAWfMuxAWxOVKDJPRT81IDD3Kgi+jAWhFiogFDEoNAIJsRCg5GdHHDvI3PryAhahKgGKN8REeieDLGgwMkjWLAgoGj1vTYt0cnMUz6fct3Ly7bNSdGrEEGXayc5+Gg9yrzPPJW86tiBAavn09bmPkYG5hGoc/LLztYn7e5cu/o303noZu1uGiDI2v++/Sey6+VyT4y8fd31RMbxYAY6SNrHPwMaukLNj43f8nLxxooUAbN757CoeH2I8+s67/w/Q0KhosZoBYCKK8E9RXqOVfj9g90oeb+F/Le7DhKoPhG4ysla5hGg88Y4BKYxmBr9dNHjIC3g/i7opB35PeW/Zu+pCB8ERlYbjG2G8S3zha41afpM2c1z75/9TZNCFkuEybT6MPjrn9q3njB3XIOVYKfAmwxFgBwCYyRicHFUMuZkaxl63pT5i7ZysqpjkJo4wPO2sprNW9fIR/UPIBRgtGfAt5qksmzhgIGWJ2ved/mOn9f5zHip0VjXZeq/zz8rJOcAIgHhzPFkUpiYPWCwQjAcPBd2rPyUOj20G/SegpdYOjm6aY3H/oavtQQA4mowBI89g+EbEwkQj6f5hu81pi7cluJZtOTlhg9Pn+1Hnz8Fb+rZ4SiWG1xNLgKHBUSE90S4oXn39ZAataCyxkFxfRdFdY+4dDY9RMHKvp+/qabfBhU1mwkHu8qTeMvlxTGdPLWu5rqXNnLtwyn5CzcEKNHPRju5h92dXz+0q+kwyMRe4tNoPDnMwavEgxx7XE2OKeJ8353TW3gVvcJmpvI13v16JUDT5wmIZ+rWjqIFUdWwGyIEbecwRHUd2X/pv1h3xjKRFLI43Y2v1NcTROppxGLhA+/VMSajg7zuDqWwmRdcNQVNoJeZ+ayDWvpV6i384sdr450NuNJZGC1XhGKEzGFlednkpgn/KDgQuFLlkItNTLylw3ZMSi2GMD8NFqCkl4Gw5iI2JHPmxeKbeTbDR6AsefKvpaxedWWSkUo31eaIxsERJYqMN8FzpTUyYkzSG41+QHhrcelZF8shAF5gUmzBRg7g78TsS2Dq/YAYjAeVX0cz8HiFAkEd7KfEihi/wdqeA4or7hwvQAAAABJRU5ErkJggg==',
    width: '30',
    height: '36',
    rotation: '0',
    opacity: '1',
    offsetX: '15',
    offsetY: '36',
  },
  '//marker': '一些选点用的图标，包括资源管理，地理编码',
  'marker': {
    source:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAfCAYAAAAIjIbwAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAK8AAACvAAsAdHPAAAAB3RJTUUH4wEJAy0MN7YNKwAAA05JREFUSMeV1suLHFUUx/FPVVc/ZpKJozhKYkSQxOATBDdKkLgQRaKooP+DgijoTnDjNsYXIhoiCMa3ohJQEEnEiJsg+EhcRHzHiQmYOM6ju2aqr4uqmtzuTJvJ2TRV95xv/c7j3tuJyqa3bxVZhptwF27BRkxgFkexHx/hS+R10Pq9B0CyAvBKPIJ7caHR9jc+xDP4NgYnQ8DbsbMCr9Z+xKOV8uU0a7sVu7FhOKoIQb8fpGmikSTDy5uwC33sjaGb8FQMDJjLF83kubwoFP2gkSRajYaJdtPaVkuEvwg78BMOp0jxIK6NlZ2YWzA9O2eml+stFZb6fb2iMJPnjs3OOz43r+iHWPEWPIQsw3W4b6ADC10nu926kzM4iN+wMeGGfgiTp7o9CabWjMeK78GrGW6L055bXHSq26sfj+AxfIoFdJQjtgNX/dPLjTeb1raatf/FuCPDtqoEYDZfVIQgYR6Px11FFx9XvdhThDAxm+cxFLalysEG/RDkRVE//lApLD2/OhQH7lPNZl709cNAbTekmFzueKDoh7pGx5Vql4EReAF/JVgKZ0DXpcpGgDQhS1OVy6U4D/bfeLX4F+twWVD6p4OzO59WzSg7nSTaWSMekfvrhwhIuYWvgXajMQw9klb1WS7kRKupmabQxBN4GJdgHOvxAJ5EO0sT69qtGBiwL5nevnWzcntdUa+c7PacmJuvy7CEnzFdjczl1QdNjY+5YKwTQ3/BnXX6e+KVyXbL1Jrxur5ZYDNuDmwJNLM0NTU+ZrLTNmRv4vt67+/G3bi+ru35nbaxLDOb53pFuU2zNNVuNKxtNXWybBh4GC9x+kA5imeVp83yJHeyhk42JiCEIEkSZ5xRpRV4vkr/9E7Ce6Jhjy1BOhoIn1epg7S+ApRXxU6ccm42ELd+74EBpZR3z1vnCH1/OMO0pg/V5tdVAv9U9iKPOekKjofw8iqhr+Dr4ZfL0Eht7XzwLMDv4o/H8QNKo4Vjyqs3HwFcwnP4fQVBK6Zf2wf4ZMTaPrw9KvAMaPTVOTyNk0Mu/ypHaGYllWdTCl/g9aF37+Cz/wtaETo0Yi8oTyn4o6rl4iiVq1FKeVe9qPwHsgvfnC1gJHRIxRt4F6+NWB+w/wD3vCGsfC8xrQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOS0wMS0wOVQwMzo0NToxMiswODowMKswftkAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTktMDEtMDlUMDM6NDU6MTIrMDg6MDDabcZlAAAAQ3RFWHRzb2Z0d2FyZQAvdXNyL2xvY2FsL2ltYWdlbWFnaWNrL3NoYXJlL2RvYy9JbWFnZU1hZ2ljay03Ly9pbmRleC5odG1svbV5CgAAABh0RVh0VGh1bWI6OkRvY3VtZW50OjpQYWdlcwAxp/+7LwAAABh0RVh0VGh1bWI6OkltYWdlOjpIZWlnaHQAMjMzz/MXEAAAABd0RVh0VGh1bWI6OkltYWdlOjpXaWR0aAAxNTifzIcaAAAAGXRFWHRUaHVtYjo6TWltZXR5cGUAaW1hZ2UvcG5nP7JWTgAAABd0RVh0VGh1bWI6Ok1UaW1lADE1NDY5NzY3MTKeBuyKAAAAEnRFWHRUaHVtYjo6U2l6ZQAxMDM4M0L7qH+sAAAAYnRFWHRUaHVtYjo6VVJJAGZpbGU6Ly8vaG9tZS93d3dyb290L25ld3NpdGUvd3d3LmVhc3lpY29uLm5ldC9jZG4taW1nLmVhc3lpY29uLmNuL2ZpbGVzLzExOC8xMTg1NjU4LnBuZzaDG7oAAAAASUVORK5CYII=',
    width: '21',
    height: '31',
    rotation: '0',
    opacity: '1',
    offsetX: '10',
    offsetY: '31',
  },
  'router': {
    '//': '路况状态颜色',
    'state': {
      0: '#9370DB',
      1: '#00bd01',
      2: '#FFD147',
      3: '#EA2121',
      4: '#B70808',
    },
  },
  'pathAnalysis': {
    busStop: {
      source:
        'data:image/png;base64,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',
      width: '30',
      height: '30',
      rotation: '0',
      opacity: '1',
      offsetX: '15',
      offsetY: '15',
    },
    planeStop: {
      source:
        'data:image/png;base64,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',
      width: '30',
      height: '30',
      rotation: '0',
      opacity: '1',
      offsetX: '15',
      offsetY: '15',
    },
    trainStop: {
      source:
        'data:image/png;base64,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',
      width: '30',
      height: '30',
      rotation: '0',
      opacity: '1',
      offsetX: '15',
      offsetY: '15',
    },
    busPathColor: [
      '#5298FE',
      '#00CD66',
      '#990166',
      '#00CCCC',
      '#6959CD',
      '#FF7F00',
    ],
  },
  'wmsService': {
    point: {
      type: 'SimpleMarkerSymbol',
      options: {
        fillColor: {
          r: 200,
          g: 50,
          b: 0,
          a: 200,
        },
        borderColor: {
          r: 0,
          g: 0,
          b: 0,
          a: 255,
        },
        size: 8,
        borderThickness: 1,
        style: 'circle',
        offsetX: 0,
        offsetY: 0,
      },
    },
    line: {
      type: 'SimpleLineSymbol',
      options: {
        color: {
          r: 255,
          g: 130,
          b: 71,
          a: 180,
        },
        width: 6,
        style: 5,
      },
    },
    polygon: {
      type: 'SimpleFillSymbol',
      options: {
        fillColor: {
          r: 255,
          g: 255,
          b: 0,
          a: 50,
        },
        borderColor: {
          r: 255,
          g: 130,
          b: 71,
          a: 180,
        },
        borderThickness: 2,
      },
    },
  },
  'wfsService': {
    point: {
      type: 'SimpleMarkerSymbol',
      options: {
        fillColor: {
          r: 200,
          g: 50,
          b: 0,
          a: 200,
        },
        borderColor: {
          r: 0,
          g: 0,
          b: 0,
          a: 255,
        },
        size: 8,
        borderThickness: 1,
        style: 'circle',
        offsetX: 0,
        offsetY: 0,
      },
    },
    line: {
      type: 'SimpleLineSymbol',
      options: {
        color: {
          r: 255,
          g: 130,
          b: 71,
          a: 180,
        },
        width: 6,
        style: 5,
      },
    },
    polygon: {
      type: 'SimpleFillSymbol',
      options: {
        fillColor: {
          r: 255,
          g: 255,
          b: 0,
          a: 50,
        },
        borderColor: {
          r: 255,
          g: 130,
          b: 71,
          a: 180,
        },
        borderThickness: 2,
      },
    },
  },
};
export default symbols;
