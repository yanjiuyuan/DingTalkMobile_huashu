Component({
  mixins: [],
  data: {},
  props: {
    size:{
      type:String,
    },
    backgroundColor:{
      type:String,
    }
  },
  didMount() {
    console.log(this.props);
  },
  didUpdate() {},
  didUnmount() {},
  methods: {},
});
