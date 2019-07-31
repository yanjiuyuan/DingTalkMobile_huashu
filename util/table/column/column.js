Component({
  mixins: [],
  data: {
    tableData:[]
  },
  props: {
    label:'属性名',
    prop:'value',
    width: 100
  },
  didMount() {
    let app = getApp()
    //console.log('~~~~get app data')
    //console.log(this)
    this.setData({
      tableData: this.$page.data.tableData
    })
    //console.log(this.data.tableData)
  },
  didUpdate() {},
  didUnmount() {},
  methods: {},
});
