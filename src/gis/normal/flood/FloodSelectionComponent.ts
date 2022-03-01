// 模块的GIS逻辑
import Util from '../../Util';
import { riverWaterSystemServe } from '@/api/installServer';
const componentBase = (G as any).base.ComponentBase;
const component = componentBase.extend({
  options: {
    map: null,
    featureLocate: null,
    featureHighlight: null,
    simpleRenderMgr: null,
  },
  mapData: {},
  initialize(options: any) {
    componentBase.prototype.initialize.call(this, options);
    this.featureLocate = options.featureLocate;
    this.featureHighlight = options.featureHighlight;
    this.simpleRenderMgr = options.simpleRenderMgr;
    this.regionCache = {};
    this.toolTipWare = new g2.widget.TooltipWare({
      map: this.map,
    });
  },
  load() {
    componentBase.prototype.load.call(this);
  },
  unload() {
    this.clearAll();
    componentBase.prototype.unload.call(this);
  },

  /**
   * 根据geom绘制区域
   * @param data {Object}
   * @param data.geom {Object}
   * @param data.name {string}
   * @param data.type {string} todo: WatershedLayer/RiverLayer
   * @param [data.fit] {boolean} todo: 是否定位，默认为true
   * @param [data.radius] {Object}
   */
  draw(data: any) {
    this.mapData.name = data.name;
    this.mapData.address = data.name;
    this.mapData._id = '',
      this.mapData.geometry = data.geom;
    this.clearAll();
    // 绘制多边形
    this._showPolygon(data);
    // 绘制标注
    this._showLabel(data);
    // 定位
    // this._locateRegion(data);
  },
  /**
  * 根据geom绘制区域
  * @param data {Object}
  * @param data.geom {Object}
  * @param data.name {string}
  * @param data.type {string} todo: WatershedLayer/RiverLayer
  * @param [data.fit] {boolean} todo: 是否定位，默认为true
  * @param [data.radius] {Object}
  */
  draw1(data: any) {
    this.mapData.name = data.paramas.name;
    this.mapData.address = '某河流';
    this.mapData._id = '',
      this.mapData.geometry = data.geom;
    const riverGeoms = data.geom;
    const riverID = data.paramas.id;
    const riverName = data.paramas.name;
    this.clearAll();
    // 绘制河流
    this.showRiver(riverGeoms, riverID, riverName);
    // 绘制多边形
    this._showPolygonBuffer(data);
    // 绘制标注
    // this._showLabel(data);
    // 定位
    // this._locateRegion(data);
  },
  getMapData() {
    return this.mapData;
  },
  clear() {
    this.clearAll();
  },
  clearAll() {
    this.toolTipWare.clear();
    this.simpleRenderMgr.remove('region_border');
    this.simpleRenderMgr.remove('river_highlight_layer');
    if (this.bufferDraw) {
      this.bufferDraw.removeBuffer('RiverLayer');
      this.bufferDraw.unload();
    }
  },
  fullExtent() {
    this.map.fullExtent();
  },

  // 河流弹窗列表点击的绘制河流
  showRiver(riverGeoms: any, riverID: any, riverName: any) {
    const self = this;
    const result = [{
      geom: riverGeoms,
      riverID,
      riverName,
    }];
    const geometryBuilder = new (G as any).utils.GeometryBuilder({
      geometryField: ['geom'],
      geometryType: 'Polyline',
    });
    const lineSymbol = new g2.sfs.SimpleLineSymbol({
      color: new g2.sfs.Color({ r: 0, g: 54, b: 255, a: 255 }),
      width: 1,
    });
    const lineSymbol2 = new g2.sfs.SimpleLineSymbol({
      color: new g2.sfs.Color({ r: 106, g: 169, b: 255, a: 255 }),
      width: 4,
    });
    const ploylineCombSymbolRed = new (g2 as any).sfs.LineCombinedSymbol({
      lineSymbols: [lineSymbol2, lineSymbol],
    });
    const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
      build: (res: any) => {
        return ploylineCombSymbolRed;
      },
    });
    const opts = {
      featureType: 'river_highlight_layer',
      featureName: '河流高亮',
      idField: 'riverID',
      list: result,
      geometryBuilder,
      symbolBuilder: new SymbolBuilder(),
      listeners: {
        click: (data: any) => {
          const res: any = data[0];
          const element: any = res.element;
          const attributeObj: any = Util.attributeSet2Object(element.attributeSet);
          self.fire('riverClick', attributeObj);
        },
      },
    };
    this.simpleRenderMgr.add(opts);
  },
  /**
   * 绘制多边形
   * @param data {object}
   * @param data.geom {object}
   * @param data.type {string} todo: WatershedLayer/RiverLayer
   * @param [data.fit] {boolean} todo: 是否定位，默认为true
   * @param [data.radius] {number} 单位米
   */
  _showPolygon(data: any) {
    const result = [];
    data.drawtype = 'original';
    data.busitype = data.type;
    result.push(data);
    if (data.radius) { // 缓冲元素
      const bufferOpt = {
        geometry: data.geom,
        radius: data.radius,
        spatialReference: this.map.spatialReference || 4326,
      };
      const geom = G.utils.SpatialOPUtil.getBuffer(bufferOpt);
      this.mapData.geometry = geom;
      const polygon = (g2 as any).sfs.GeometryFactory.createGeometryFromGeoJson(geom, 4326);
      let center = polygon.getBaryCenter();
      center = {
        type: 'Point',
        coordinates: [center.x, center.y],
      };
      this.mapData.geom = center;
      const bufferData = {
        geom,
        drawtype: 'buffered',
        busitype: data.type,
      };
      result.push(bufferData);
      if (data.fit !== false) {
        this._locateRegion(bufferData);
      }
    } else { // 原始元素data
      const polygon = (g2 as any).sfs.GeometryFactory.createGeometryFromGeoJson(data.geom, 4326);
      let center = polygon.getBaryCenter();
      center = {
        type: 'Point',
        coordinates: [center.x, center.y],
      };
      this.mapData.geom = center;
      if (data.fit !== false) {
        this._locateRegion(data);
      }
    }
    const symbolBuffer = this._getBufferedSymbol(); // 缓冲样式
    const symbolMainWatershed = this._getWatershedSymbol(); // 河流主体样式
    const symbolMainRiver = this._getRiverSymbol(); // 流域主体样式
    const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
      build: (res: any) => {
        if (res.drawtype === 'original') {
          switch (res.busitype) {
            case 'WatershedLayer':
              return symbolMainWatershed;
            case 'RiverLayer':
              return symbolMainRiver;
            default:
              return symbolMainWatershed;
          }
        }
        return symbolBuffer;
      },
    });
    const geometryBuilder = new (G as any).utils.GeometryBuilder({
      geometryField: ['geom'],
      geometryType: 'Polygon',
    });
    const opts = {
      featureType: 'region_border',
      featureName: '流域、河流',
      idField: 'districtcode',
      list: result,
      geometryBuilder,
      symbolBuilder: new SymbolBuilder(),
    };
    this.simpleRenderMgr.add(opts);
  },
  _showPolygonBuffer(data: any) {
    const self = this;
    const result = [];
    self.currentStatus = 1;
    data.drawtype = 'original';
    data.busitype = data.type;
    result.push(data);
    if (data.radius) { // 缓冲元素
      // data.geom = turf.buffer(data.geom, parseFloat(data.radius + '') / 1000).geometry;
      const opts = {
        geom: (g2 as any).sfs.GeometryFactory.createGeometryFromGeoJson(data.geom, 4326).asWkt(),
        radius: data.radius,
      };
      // riverWaterSystemServe.riverBuffer(opts).then((res: any) => {
      const geoWkt = riverWaterSystemServe.riverBuffer(opts);
      data.geom = (g2 as any).sfs.GeometryFactory.createGeometryFromWkt(geoWkt, 4326).asGeoJson();
      const bufferDraw = this._getBufferDraw(data);
      const param = {
        id: data.type,
        name: data.type,
        data: {
          type: 'wkt',
          geom: geoWkt,
        },
        buffer: {
          radius: 0,
          buttons: [{
            id: 'showPanel',
            // visible: true,
            position: 'right',
            style: {
              type: 'PictureMarkerSymbol',
              options: {
                source: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADUAAAA0CAYAAAAqunDVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkQ0MkM2MzdFQUFFNDExRUFBQjRDRkQ3MEM5NzI3NjU0IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkQ0MkM2MzdGQUFFNDExRUFBQjRDRkQ3MEM5NzI3NjU0Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RDQyQzYzN0NBQUU0MTFFQUFCNENGRDcwQzk3Mjc2NTQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RDQyQzYzN0RBQUU0MTFFQUFCNENGRDcwQzk3Mjc2NTQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4bT8xaAAAWdklEQVR42rRaaZBdxXU+3Xd9y+zMCElo0C4EEkIS+xabTSymHNs4LgRJqpI44MLFj5BKmaTKTrmyVGHKiflBCFUp/7CNwcHYRhiEsbFZJcoCsQgkgTRaR8tIs7557913l+58p/u+mTfa4E9e1a377tK3z36+c7oFXXARkRBkfxpH83/LtdYt75zip7V9KOjU4+07Z/5Gy8dmfuN0r4jT3hO0YjXRhnfoM/9uXyNO+Gjr18XMCZhZcQphzeD6dMxMP9vwjp4xSswceeKzz87UF1aLnBE781U3CpoYFdTeJSmq2mdRQ9DwUU1ZKmjo8Gk5aWFcU99sQY6raW6/JTQsajNqfFRRR5em11/SZ2TwlHx9GlOsGf5dfaOk/oWCRo4J8nxJ0pHUqIMgnONYgAiiRkNSvappcgJkKEGTFU2V8VOZjKaz50oS0hLY3klUbidqw+H5mnwcrp9RdQJnL6Pu3lyLWtFPHtP03FZ9Jq25n2pq6+9lp5KGGSKHuvvATORQEDi4lpRlOEtJhSJRHNlxnkfQogbDLHloEIy2+kBHN7Rb1+ZZR5cwGnMcYZh0MdYPFbSXUWePIj/IMEKBhtSMvetepisznGwAc/pk83PPaG7X3CStX4D47l4XEziQOI/xzL0gdCiqOSS01RibEROvoBYvEFSdtMSSUDO+nSYC2hDk4lNxg6irh8drknhV4qyhESlTfF9BaFnOkOSRhsH195A5377aMnaCJ7rGLE6lIWaofxFrCTMLCbPwSCkfUuRrD5L2MBYMCT4knkl8UJHKmvZgGUxTS8CUbXgChApjNsyQh2s2Xz+0Juq6AhpUFIaaimVFpXJKbhCTzlI8j6heS8B8Ap9Naf03wNiak/zMPSk0GpO7R+Sx3KWg6JBKfEjSI+EElCUhTBv/wZjCc6WgPbJMMVVsQmxOLGA+GyZzpphoCVPVqulgNjpyYGFGOTVIyVqEWfY4VC7DrEswRS8hR9TxfpUa8SR8rUZ9c4iGDrHEMkNzC2PuyUHBPJPmGTOkU58kOwkVSLohqbgAonBP+qCLtQbG4FesEWZEgeA0YRNixrThxJHC/Be5VwtcJ2yCMFHLNM5gDJQb4RVLLoWBT6U2H0zBSsAUUQ1vHScZeeZ7PAeb9Xr42BOPZWcOFOu/4ZjAwCanmCF4rtDMUBH0FQxzJMFcEt4wp7P7/isXXNXfW1xBvtt/9/vzDmyr95Qg2TbDlPXcmc48lbbyHKaSBiXRyL8v39R5cfeBYKKaDrx1JNn50KG2AzC9IgUF30RAocchmAIEAwElKc4xmE+oNqmMZbWYoTsVD5uhm6+LZYeS2DMMSRGAP4QpXYIWipBs8bLutu5Hb73tzuWzzrp+82ha/dFI1L1t5y697a03+mhgn6ZaRRnNsJUpZeQDn7BT8bWHaTkosOZK7ZJ6ehc9PNDnXLr2ErmyX/RftnT35U8uO6I3DBa2bI26R5eGnvvLenoQDiopSRsIQjUcVZhtIxeRNcNpTbXAmLtyLdWqDqTjQu0+pAJzI/iRLoLQ0t8sm7f4O+su/8ePxkWtuAWm95sXO+j1FyOMyWCCYCiyEUyBqUxZJnhinefQBL4TBNbApTE3UCHE8NsevfCrQL6waJlL677SdvmKUv2LvQNXPtzR6c1yffdb+yq/e+gYEqAQbaCphHOA7/hIL1mebmzERg6TU5pq2nt10jHMauVSo+ZTmiE4ZCZAfGlRT//f3bzqnx/Zm0yse318Pn3/2yn94dcN82GFwRls3PwT9mCbl1IhwCCUINxLjwNJ/ozvS5uDlKNs5MS9wwdT2vhktPnVHf6Dg2uR5bVjnEch0iYp0wKaEo/SGAI36UUiUUu66gbZDHpWU9b0LFooIuIksUN+Gw9kfwogZY63xftuXvrA/x5SY997Z3Qx/fiRCLDIxm8lDEnmbAQkWfocE40yOO2YH8xRCwxhBo0/sV85VpNgEZpVlODdGHFh5zaIJ3GWOtfq7855v3Y0Ax2NYgyL0AjrQC51BKdYGB4cJ6NzFwtAKmpGuenfZEWYnON5DgZyXkI+wjmJ/Qdv7r/2mErL39nmzaenHo0QWq12lDbsmMDAIZwJDqQSZU97kIvT7lPYHYqwOxB+F2JMG0yvDFn5zLirOBlAu9CyZj9UYEhTNQK8gjnv+jgb37RZPXakX9xy9t5V59SPx1SZiEBnBvQiYCGuUQCniZEh0aKpFlwWhhKqRV6CWSJjUCLYDE1YX3Je+OWHBs7poGcej2myahnSLFmdEwSGXJa81F7JQ9ASolguyLOXL3E7+3plEkV6aM++7MDHe1MHoTuNlMZBOsZYT0jjBSZKQ1V1pKRRaZNzZZPe3tEXTPS5Y/cv3L38H35f3E5xPdcW0EyaSJPjKhXRjK3utD/hRj3izA7AKjjv2KCBXLRqabk3CuLZW7ccdGhgRx2xhhnRJiclYIzPJqHiflEKpyzl5V++LVx9662FoBSK1og+vP9g+tpPn6pt3/x+ouPURsW6ERGCBq5ThG+qAC/CBKvwQR8u9fzT8cZVd7bf3/fCShqZfBLMQrea3YTBtDRJu1ETzSjuzsggCUqHqM5hkw1eWKSQyvnLOhZvGw8TevU3GaKXNhiPTUbDwR02OUzMOLQoye/w5Ff/6YG2Oect8SaGjmfbfv9iXDl6NOPsMGvREnfBJZcFX/z7B9pnP/3z2qZnXqxFEwllVTCTQChMDvtJ5imYt+a5CcCfJifTt9475s36UjafhoeRoyBvldrShv23VpWtcM/NazObCBlo1qrNHGKLQeSbYSWLQ2PtBfr4gypsnhlRBrRmuZYZXAdwxZIn1v3tX5SYoR2vvRq9+9wz9SQ1dmoC694Ptibv/m5j48Z7vlm+/M++Uhw+eCj96M13Y5VJrVnzWY5KOFBI1hpHT64NNB3e/H46emunpvG9uMf3Hev/rCWVWfyYm5+cgmCMxkeOc5lgbXliXJt6qDZJr2+dP7rplYLGQEyE6JRmFomr3AQhOOE7Yt7SfnfZ1VcGh7dvT97+1c/rKfy+1Nkpl11xTbBw9VrPQU6aGD2u/vA//zUZRw19xZ13lNzQERJjOVch0trvsTA5YjKDmZlP0ycfZ1dvWV8F7iOD/qsTCrUa6KuxP1kN5+nJnS7e8gxfrdqQrNIcAeCDIao4rkQZJfBhkquRA3sCTM8VPixy2TVXhvylLc9vqGegbdbCBe71X7+v7Aa+sfexwcH02R98b7I6OqY+3vR644Lrrg/nLDzX2fP+bmWtQ1KOQiwMYQvi+fnf8FAGs+9E9LN1mpQ5YOb3M5s78uAgZ6B0Rst1MMVON4nBXMVGiESOXzBnoyFlJzaBQuc4DvgSNHTPnevUKlV1fM/+lOe5cN3tIU/+xhM/rG5/7eWoc+5cd8klV/hJjBy742MGqdQ7/1wT1w1DxmLyajjL04UVLIJJjR/7hqZ6TZlrzlkNIJgqNDU2PAOli6lAwSW56+YAkIFozIwqI61UWQSuMmt2Ite2NKFYpyDULxRFVKloBtCIMLrY3iHHjx7OBnduS8aOHsqWX3NdWO45S0KLemJkTPHEQaldqFTN7OHk5ZixIp5TGEnaZ40G/jSYTuuDbDMMu44f1c1IPhOlj6ME7+4VxqdYOlwbqRyY6nwmbVsFlhtWv0EGQFGaNvzH4xUFuYM/pH8Tasw4lkETtLNCJB4M7T+Y/edd9xyPaxnJvGKZwofN3Gnmad5X9lES24cNJGg2QS4yWWMm3NnU5J7U5hoeAuehzgs620BpTtZo2FDEAYOjQ/OdjEOx0Id27kmp7IhSuytd4QmGR8xQtd4gt5hOTZHg5QTCqsPcM53ZQpKPNLOkcPKVzRqFNYUgphNLZRJbK5EOBwdtSo/pXHtiPdUCbONGU2TKHCaxMqwJGGWTqUxNJ0jayX1M4OF/0SUZKNF39lkyaPcFoxf2cd/xgUatr3T0zXYWX7zWqw+PqbGhUTV8dDSLwoyyyQRQgPMu0IJbyLWk7LmJHXXOVJM2G+RabNb+d0/sQ56y36hP7N7mkUo7+Q0w5aPwCl2x7q+/Vrrg2mtDxxXGakcGOWhwvIk5VtK888/3+nE0vbpRqak3nv5F7a2Nr0Y6496hY2nLxLSQxYwux2nJJGFpPHU3icts2y/gfoI0fQORa4XVzhSbxCdsKMYlBS6df9kqf+V1fxIOH9yfRgi9c5ev8FiYgH1Um5hQP/32v44Xz+qS3b1dstDRLsudHeKc5Sv86/7yrvLQwL509wcDiXVV2eJXeXHZvOf5wmiH+44qIQOAp81PtwLa6f5B9yxpELCN/Rz97DM+mJkslaZOMpPk+YIP1xG9C+aZOuKdjb+MRo4czr7wzQfbGHVM1DFBPdMjY4MpfbCHQiB1v80VBU+I/lXb05v+6uvl2UsWeXs/2ptmjrRlSd6ZM1FF59ahc6b4D5uBC+EXUCoxrRPjU34lp7hkqXR026zOIbJQshrjQ+aTCJibdJk5MvirGXGESYR0ZN8BU1L3LVjmAnPq3e+8HXMxnExmOqmCigrgwUSmokqmG5NKR4nQXb1nOzY+Hckybo/xodkyWGBu/u1ccFZTZHqKpbLtOrHNFUq2IZrr151yFr7Z0WWTK3+4EYkcZUiTrY02+HWGNI6VlBTN0G7cdue2nckN8JG5y1Z4m5//bf3N516qO7IkdB3fjiAsLlOQN1FvmZypPSV65sxzeMqhfYMoXoABdVNI2sIc4wI8USqNbwWBNELl4BFyD4jb3vhYTx+jjhPqKaM3hOugYCMbq1kp6+0ZSOAWsetzaAVM8az2TILmkM/wxhEx8PC+Dz9Ml192iV/u6nEO7DuWZRUkosx23LiCN0BVWrMV0ERPf78zMXQsG4nAsTaNC7tgwAlQMDY1TWKrFZSGRivcDTZ+Lix9LGwWfM7UtPk18V8JZseqDXEutvE1ypHKKLV1SWPfrHrDrOJeHopKfJTrojqIqif00R+3mpi74MILPUY6SGvQLEKZi/c9ENmJQjRA8PFxlD3Z3t3tHN2/H0kryfMfBJpw4We+z40i283t7EWNl41TWztMD3SV28gwWCxps7jge3pmoGjGw+4e9iMLFFkSaWqddCWAZH+npCdLHG2EcVCjQTMU0tRcjhhNb/9gV9KoN/SSi1Z5b736ZqPhAweHBitaL05hKqWQvIIU5y1b5LIihg4eTnHDFokCNV3Rz7Wa0yYxdukFzk8u31u868l2m5uka+2ev8qNVK4oZtZTwiIIF9wWytYZOdObFAfGWEKdIqZF57u0e0dmbJr7Em4TJeca585znNHAhzuS8y5e5a+9+opgYmRcKYA97qcYQJAlFIbcZCWx8pKLfb65b9eB1KAS9lvWbAChCWN+ID5vLay50PXC8QyasdqU0iZgPtdQioRBi6bEVJLjlQowVbRFmHZzRIF7B0b20+cAGdZeI2k/ygTjb7yMY2xaGcTOOjXWoumVjW9ECy9Y7l37p7cVPm2BbODDT5J9u4/yfJaBgHsWRlPSMoUvt3fK81fOpsGJD3cZ+szig7RnLij5XlSbAgrujFW9AuyE0a/rqbzjyRApoYHBY07dGcrWLO6mLYskHTtil104GGdamo4Qs8XtvIT7EGPq4X97vHLRygVuGPhSt0CzBPjORT2kUPgdPzaq9mzbk1ACMjJpTcnlPh4EyBozERDfv+Y2//Nzto98dGDkLfLDzPTcuBPFLTUhbBXBK5D8gefemdF4gbNHyqwyhKEiLltdGHkCe5JunG0/+CwtPfcOuv6rPfTsD2MEB9sWY4YcZbtBBoqD0waOow397sjOlPHvFDg1yzcJmYU1A2JxI/Fy8wVhphCCr/isNY6qCDBLVji0enatvfOD4KEfTb4Mn0+gJbuck8KZXEcZgFBumzI/OQM8teGBh6DFjBSLGIjBIc6eG9PLr7wE5qu0sniIbvyajxArTWj3kLR4udThRTRENo08QgVuniAygrgE/hHxgaK4gSPBEfv2f+zxc4gF7zmcf7jR4UmzhsWBYO4Chz5/q7xz1Yb4jx+lP8vqehwaSuCQKWjLkH4QYPzMaKwyoZqgXE4vDnP067M9PPMiPNpxmDHUDV5ErqzSi5u+T/NlO13QPUi33O1TZ7djmHFCXpSzzCGsmUOAMQ0IQx0gEpHT6wFQzw/B6aEdz9owtoBxRV6VhIYCaRAMC2fxapduucO56NIfHz8yGQ389vnk19BKA3PwAkGMYJVwsW8WB1SmpmDUSUs5+3drs85KIrUrhA4GM1bh95yIDgzsohe8f6GbLv0W9bQNUdef99K2D4k+2ZZy1EP0g21zFPMtLuP0UMQ5DAyKt7UXwmUNJshrvnUuRpHWshjkIU9hWiOo89biqNeDyx7NdhwPP4l+VnwEZlyFkGvIjxHoj+FqOLiRAp/i/sAbL6mT91E0l3LW38Pu70MaHogI8qWcslnKybISPlSg9r5ZdN3n7qN5pdV0CJI6TAENg8C9k6xpjManymCuE4z04MxK4VzFuSziRQgcYxDCKHyQazy+14HC8OyaoL5RRf3vpRSOJ7S172l6Jf4FBFuHZqqgoYpoW8N1DYk6ojRpwOwSJOSMnvjvrGV9qmV/wu2rm5s5ECB4PdY0vPPwyiWHZKdMafRIQk898V2atWQhrVp5M81uP58WBT3whzok6FI7eTigdcZqRGtgJXebS0FbAFYe7cHcczFPBaKt4MGEjumcXQ717JM0rgbpva7N9GbwEunaCEwfhAhGinXDkAttNQA90jRBzuKeQzZVbU3Fo9Z9FFPautex672wd50hQfJqIhUgrRAldAEf9MGcD2m51Ki7pqddm+R+nO3J1fmAeXE/oVFXBpmYJgTZqplxGue6ImAOb1UIcWb4U4RBFAowYRDrudBWAT4NP5JuAy6Ps9FQDMuJIfRkarW+RUsn+5TR1pq8zoSBN2ASQSE2PUBpWr22xualSV4RsT0Ou0LPEYtznKmvHDVdtIm8j9esnE1XVdsSg3ORZNSfVwSMHcxYoBYPAQAW40gGhJgPTKXIBzz3iQydsPTqnrRrxDLGO1w09S+0jAGQwaDskosfpEZTUgLraLuMIg3ktlsOzL4JsjDGNGacfHU+z4UMhFkApgvAodyARjLlTLNByYgmTZAfOXLonCmgWwkGY7MmluZ7M9TUJpGWNovFfidupbD+pehq3kux0G7MYFPinShpw7UbNqhBvLqnzWHrHoZKzc0gthefX7d0GPgtJy8w+cyf8r28RM+hD69T+Uj8DvfbwATnzjSZ1o5hSLOW9EmbQ2ZivxP2+PDLt6+xK9/8YORYQt29Fj41GqndxsNrV5p7Fbak5uYilw/NRWoPADmKWro3wiKKQps1QUbXxTYx1R5jv+OU45kFiMx0Yn3kzCSx7mAqQ5FvMdB0Koamfep0W82sxshEGN5wxRuf7IarzCx2NTdcMd6J6s3uiK2LWPJcy/OCA4mZ+wa5vc31EJtaZcw+NtCJFwW4ruKqId9w5UBLPX3N/h2085ieEvrpd5FdxC+cct/cDEantyRYp776RkFjIwLJklf0LBiNIq4+861xh06za7G11QYu++ZAMNDonHPs60HRzjqBfNXepZFU/x+2xp1uq9w0ca2bGs+0wfHMmxinOlqfYRPjpyjgszF1pp2QJ+7W/PStqad5LxcSSgfSn0G4p6MJ9/9PgAEAmYDY2WfCU1QAAAAASUVORK5CYII=',
                width: 53,
                height: 53,
                opacity: 1,
                rotation: 0,
                offsetX: 20,
                offsetY: 60,
              },
            },
            // event: 'click',
            // 点击河流缓冲区右上交小手触发
            callback(e: any) {
              self.currentEle = e;
              const layer = e.layer;
              const ele = e.element;
              ele.symbol.width = 53;
              ele.symbol.height = 53;
              self.fire('showRiverPanel', 1);
              layer.update(ele, true);
            },
          },
          ],
        },
      };
      bufferDraw.buffer(param);
      const geom = bufferDraw.getBufferGeometry();
      this._fitBounds(geom);
      this.mapData.geometry = geom.asGeoJson();
      let center2 = geom.getBaryCenter();
      center2 = {
        type: 'Point',
        coordinates: [center2.x, center2.y],
      };
      this.mapData.geom = center2;
      // });
      const bufferData = {
        geom: data.geom,
        drawtype: 'buffered',
        busitype: data.type,
      };
      if (data.fit !== false) {
        this._locateRegion(bufferData);
      }
    }

  },
  _colseButton() {
    const self = this;
    const e = self.currentEle;
    const layer = e.layer;
    const ele = e.element;
    ele.symbol.width = 53;
    ele.symbol.height = 53;
    self.currentStatus = 1;
    ele.symbol.source = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADUAAAA0CAYAAAAqunDVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkQ0MkM2MzdFQUFFNDExRUFBQjRDRkQ3MEM5NzI3NjU0IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkQ0MkM2MzdGQUFFNDExRUFBQjRDRkQ3MEM5NzI3NjU0Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RDQyQzYzN0NBQUU0MTFFQUFCNENGRDcwQzk3Mjc2NTQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RDQyQzYzN0RBQUU0MTFFQUFCNENGRDcwQzk3Mjc2NTQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4bT8xaAAAWdklEQVR42rRa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';
    // self.fire('showRiverPanel', 2);
    layer.update(ele, true);
  },
  _getBufferDraw(data: any) {
    const self = this;
    const bufferDraw = new G.interact.Buffer({
      map: this.map,
      radius: data.radius,
      close: {
        visible: true,
        style: {
          type: 'PictureMarkerSymbol',
          options: {
            source: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADUAAAA0CAYAAAAqunDVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkE5QjcxMDI4QUFFNDExRUE4RTRFRThGN0EzREU3MUE3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkE5QjcxMDI5QUFFNDExRUE4RTRFRThGN0EzREU3MUE3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QTlCNzEwMjZBQUU0MTFFQThFNEVFOEY3QTNERTcxQTciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QTlCNzEwMjdBQUU0MTFFQThFNEVFOEY3QTNERTcxQTciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7T7+jSAAAV9klEQVR42oxa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',
            width: 53,
            height: 53,
            opacity: 1,
            rotation: 0,
            offsetX: 20,
            offsetY: 0,
          },
        },
      },
      fill: {
        visible: true,
        style: {
          type: 'SimpleFillSymbol',
          options: {
            borderColor: {
              r: 0,
              g: 222,
              b: 255,
              a: 255,
            },
            fillColor: {
              r: 0,
              g: 222,
              b: 255,
              a: 50,
            },
            opacity: 0.8,
            borderThickness: 2,
            style: 5,
          },
        },
      },
      onClose() {
        self.fire('showRiverPanel', 2);
        self.toolTipWare.clear();
        self.simpleRenderMgr.remove('river_highlight_layer');
        // self.simpleRenderMgr.remove('monitorWarning_river'); // 同时移除监测站点
      },
    });
    // 加载
    bufferDraw.load();
    this.bufferDraw = bufferDraw;
    return bufferDraw;
  },
  _getRiverSymbol() {
    const symbolMainRiver = new g2.sfs.SimpleFillSymbol({
      borderColor: new g2.sfs.Color({
        r: 0,
        g: 0,
        b: 255,
        a: 180,
      }),
      fillColor: new g2.sfs.Color({
        r: 0,
        g: 0,
        b: 255,
        a: 75,
      }),
      opacity: 1,
      borderThickness: 4,
      style: 5,
    });
    return symbolMainRiver;
  },
  _getWatershedSymbol() {
    const symbolMainWatershed = new g2.sfs.SimpleFillSymbol({
      borderColor: new g2.sfs.Color({
        r: 241,
        g: 255,
        b: 19,
        a: 255,
      }),
      fillColor: new g2.sfs.Color({
        r: 150,
        g: 134,
        b: 0,
        a: 153,
      }),
      opacity: 1,
      borderThickness: 2,
      style: 5,
    });
    return symbolMainWatershed;
  },
  _getBufferedSymbol() {
    const symbolBuffer = new g2.sfs.SimpleFillSymbol({
      borderColor: new g2.sfs.Color({
        r: 0,
        g: 222,
        b: 255,
        a: 255,
      }),
      fillColor: new g2.sfs.Color({
        r: 0,
        g: 222,
        b: 255,
        a: 50,
      }),
      opacity: 0.9,
      borderThickness: 2,
      style: 5,
    });
    return symbolBuffer;
  },
  /**
   * 绘制标注
   * @param data
   */
  _showLabel(data: any) {
    if (!data.name) {
      return;
    }
    const bufferOpt = {
      geometry: data.geom,
      radius: 1,
      spatialReference: this.map.spatialReference || 4326,
    };
    const geom = G.utils.SpatialOPUtil.getBuffer(bufferOpt);
    const polygon = (g2 as any).sfs.GeometryFactory.createGeometryFromGeoJson(geom, 4326);
    const center = polygon.getBaryCenter();
    const name = data.name;
    const contentTemplate = '<div>' +
      '<label style=\' width:auto; text-align: center;height: 45px;color: #fefefe;padding: 1px 10px 1px 10px; background: rgba(24, 62, 80, 0.60); border: solid 2px #37e0f5; border-radius: 5px;font-size: 24px;font-family: \'Microsoft Yahei\' , \'Arial\', \'Simsun\';\'>' +
      name +
      '</label>' +
      '</div>';
    // 创建提示框
    const tooltip = new g2.widget.Tooltip({
      anchor: center, // 提示工具在地图上停靠的位置
      content: contentTemplate, // 提示的内容
      layerId: this.map, // 提示工具所在图层ID
      offset: [-44, 0], // 位置偏移量
    });
    // 将提示框加入到信息管理类对象中，显示提示信息
    this.toolTipWare.add(tooltip);
  },
  /**
   * 区域定位
   * @param data
   * @param data.geom
   */
  _locateRegion(data: any) {
    const fitOpts = {
      type: 'geojson',
      geom: data.geom,
    };
    this.featureLocate.fit(fitOpts);
  },
  // 视野定位
  _fitBounds(geom: any) {
    this.options.featureLocate.fit({
      type: 'geojson',
      geom: geom.asGeoJson(),
    });
  },
});
export default component;
