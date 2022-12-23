<template>
  <div style="display: inline-block;" :id="'map-' + random">
    
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'txmap',
  computed: {
    ...mapGetters({
    })
  },
  components: {},
  props: {
    longitude: {
      required: false
    },
    latitude: {
      required: false
    }
  },
  data() {
    return {
      random: Math.round(Math.random() * 10000),
      uploading: false,
      map: null,
      markerLayer: null
    }
  },
  watch: {
    longitude(value) {
      this.updateMarker(this.latitude, value)
    },
    latitude(value) {
      this.updateMarker(value, this.longitude)
    }
  },
  methods: {
    initMap() {
      let center = new TMap.LatLng(this.latitude, this.longitude)
      //定义map变量，调用 TMap.Map() 构造函数创建地图
      this.map = new TMap.Map(document.getElementById('map-' + this.random), {
        center,
        zoom: 15,
        scrollable: false
      })
    },
    addMarker() {
      let center = new TMap.LatLng(this.latitude, this.longitude)
      this.markerLayer = new TMap.MultiMarker({
        map: this.map,  //指定地图容器
        //样式定义
        styles: {
          //创建一个styleId为"myStyle"的样式（styles的子属性名即为styleId）
          "myStyle": new TMap.MarkerStyle({ 
            "width": 36,  // 点标记样式宽度（像素）
            "height": 36, // 点标记样式高度（像素）
            "src": 'static/images/marker.png',  //图片路径
            //焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
            "anchor": { x: 18, y: 32 }  
          })
        },
        //点标记数据数组
        geometries: [{
          "id": "marker",
          "styleId": 'myStyle',
          "position": center
        }]
      })
    },
    updateMarker(latitude, longitude) {
      let center = new TMap.LatLng(latitude, longitude)
      this.markerLayer.updateGeometries([
        {
          "id": "marker",
          "position": center
        }
      ])
      this.map.setCenter(center)
      // this.map.setZoom(15)
    }
  },
  mounted() {
    this.initMap()
    this.addMarker()
  }
}
</script>

<style lang='scss'>
</style>