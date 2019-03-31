var app = new Vue({
  el: '#app',
  data: {
    ticker: "",
    amount: "",
    addItem: null,
    items: [],
    findTitle: "",
    suggestions: [],
    findItem: null,
  },
  created() {
    this.getItems();
  },
  watch: {
    findTitle(newValue, oldValue) {
      this.suggestions = this.items.filter(item => item.ticker.toLowerCase().startsWith(this.findTitle.toLowerCase()));
    },
    addItem() {
      this.getItems();
      console.log("watch  items function called");
    }
  },
  methods: {
    fileChanged(event) {
      this.file = event.target.files[0]
    },
    async upload() {
      try {
        let r2 = await axios.post('/api/items', {
          ticker: this.ticker,
          amount: this.amount,
        });
        this.addItem = r2.data;
        this.ticker = "";
        this.amount = "";
      } catch (error) {
        console.log(error);
      }
    },
    async getItems() {
      try {
        let response = await axios.get("/api/items");
        this.items = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    selectItem(item) {
      this.findTitle = "";
      this.findItem = item;
    },
    async deleteItem(item) {
      try {
        let response = axios.delete("/api/items/" + item._id);
        this.findItem = null;
        this.getItems();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async editItem(item) {
      try {
        let response = await axios.put("/api/items/" + item._id, {
          ticker: this.findItem.ticker,
          amount: this.findItem.amount,
        });
        this.findItem = null;
        this.getItems();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
  }
});