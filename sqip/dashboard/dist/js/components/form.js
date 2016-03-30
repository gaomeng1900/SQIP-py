
/**
 * DASHBOARD 
 * @author Meng G.
 * @description part of SQIP
 *
 * @requires store
 * @requires vue, vuex, requests
 */

/**
 * 表单 =======================================================================
 */
var Form, __form_tpl;

__form_tpl = '<div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main gm-form-wrapper">\n	<h2 class="sub-header">{{title}}</h2>\n	<form class="form-horizontal gm-form">\n\n		<div class="form-group" v-for="input in stru.inputs">\n			<div class="input-group">\n				<div class="input-group-addon">{{{input[0]}}}</div>\n				<input type="text" class="form-control" :name="input[1]" v-model="fd.inputs[$index]">\n			</div>\n		</div>\n\n\n		<div class="form-group" v-for="text in stru.texts">\n			<label>{{{text[0]}}}</label>\n			<textarea class="form-control" rows="3" :name="text[1]" v-model="fd.texts[$index]"></textarea>\n		</div>\n\n		<div class="form-group" v-if="stru.img">\n			<label>{{{stru.img[0]}}}</label>\n			<div id="img_btn_wrapper">\n				<input id="img_choosen" type="file" @change="upload()">\n			</div>\n			<input id="img_uploaded" type="text" :name="stru.img[1]">\n			<img :src="fd.img" id="img_thumb" class="img-thumbnail">\n		</div>\n		\n		<div class="form-group">\n			<div class="btn btn-default" @click="send">Submit</div>\n		</div>\n	</form>\n</div>';

Form = Vue.extend({
  name: 'form',
  template: __form_tpl,
  data: function() {
    return {
      fd: {
        inputs: [],
        texts: [],
        img: ""
      }
    };
  },
  computed: {
    stru: function() {
      return this.$route.stru;
    },
    title: function() {
      if (this.$route.params.id) {
        return '编辑: ' + this.$route.params.id;
      } else {
        return this.stru.title;
      }
    }
  },
  methods: {
    upload: function(ele) {

      /**
      			 * 上传文件，传入input[type=file]节点
      			 * @param ele {Dom element}
       */
      return new Requests({
        url: _STATIC_SERVER_,
        params: {
          uid: 'yayaya',
          token: 'houhohuo'
        }
      }).upload(document.getElementById('img_choosen').files[0]).progress(function(args) {
        return console.log(args.progress);
      }).load((function(_this) {
        return function(args) {
          _this.fd.img = _STATIC_SERVER_ + args.key;
          return document.getElementById('img_uploaded').value = _STATIC_SERVER_ + args.key;
        };
      })(this));
    },
    send: function() {

      /**
      			 * 表单发送
      			 * 验证所有项非空
       */
      var _index, back, form, i, item, j, k, len, len1, ref, ref1, v;
      form = {};
      ref = this.stru.inputs;
      for (_index = i = 0, len = ref.length; i < len; _index = ++i) {
        item = ref[_index];
        form[item[1]] = this.fd.inputs[_index];
      }
      ref1 = this.stru.texts;
      for (_index = j = 0, len1 = ref1.length; j < len1; _index = ++j) {
        item = ref1[_index];
        form[item[1]] = this.fd.texts[_index];
      }
      if (this.stru.img) {
        form[this.stru.img[1]] = this.fd.img;
      }
      for (k in form) {
        v = form[k];
        if (v === void 0 || v === null || v === '') {
          console.error('WRONG ARGS:', k, v);
          return;
        }
      }
      console.log(form);
      back = this.stru.back;
      if (this.$route.params.id) {
        return new Requests({
          url: _API_SERVER_ + this.stru.path + this.$route.params.id,
          params: {
            uid: getCookie('uid'),
            token: getCookie('token')
          },
          form: form,
          load: function(args) {
            console.log(args);
            return router.go({
              path: back
            });
          },
          error: function(args) {
            console.error(args);
            alert(args.error_msg || args.error_info || args.error_code);
            return pro_bar_end();
          }
        }).put();
      } else {
        return new Requests({
          url: _API_SERVER_ + this.stru.path,
          params: {
            uid: 'yayaya',
            token: 'houhohuo'
          },
          form: form,
          load: function(args) {
            console.log(args);
            return router.go({
              path: back
            });
          },
          error: function(args) {
            console.error(args);
            alert(args.error_msg || args.error_info || args.error_code);
            return pro_bar_end();
          }
        }).post();
      }
    }
  },
  created: function() {
    console.log('created', this.$route.params.id);
    if (this.$route.params.id) {
      new Requests({
        url: _API_SERVER_ + this.stru.path + this.$route.params.id,
        load: (function(_this) {
          return function(args) {
            var _index, i, item, j, len, len1, ref, ref1;
            console.log(args);
            ref = _this.stru.inputs;
            for (i = 0, len = ref.length; i < len; i++) {
              item = ref[i];
              _this.fd.inputs.push(args['pro'][item[1]]);
            }
            ref1 = _this.stru.texts;
            for (_index = j = 0, len1 = ref1.length; j < len1; _index = ++j) {
              item = ref1[_index];
              _this.fd.texts.push(args['pro'][item[1]]);
            }
            if (_this.stru.img) {
              _this.fd.img = args['pro'].img;
            }
            return pro_bar_end();
          };
        })(this),
        error: function(args) {
          console.error(args);
          alert(args.error_msg || args.error_info || args.error_code);
          return pro_bar_end();
        }
      }).get();
    } else {
      pro_bar_end();
    }
  },
  vuex: {
    getters: {
      edit_state: function(state) {
        return state.edit_state;
      }
    },
    actions: {
      finish_edit: function(store) {
        return store.dispatch('END_EDIT');
      }
    }
  }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvZm9ybS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7QUFTQTs7O0FBVEEsSUFBQTs7QUFhQSxVQUFBLEdBQWE7O0FBa0NiLElBQUEsR0FBTyxHQUFHLENBQUMsTUFBSixDQUFXO0VBQ2pCLElBQUEsRUFBTSxNQURXO0VBR2pCLFFBQUEsRUFBVSxVQUhPO0VBS2pCLElBQUEsRUFDQyxTQUFBO0FBQ0MsV0FBTTtNQUNMLEVBQUEsRUFDQztRQUFBLE1BQUEsRUFBTyxFQUFQO1FBQ0EsS0FBQSxFQUFNLEVBRE47UUFFQSxHQUFBLEVBQUksRUFGSjtPQUZJOztFQURQLENBTmdCO0VBY2pCLFFBQUEsRUFDQztJQUFBLElBQUEsRUFBSyxTQUFBO0FBRUosYUFBTyxJQUFDLENBQUEsTUFBTSxDQUFDO0lBRlgsQ0FBTDtJQUlBLEtBQUEsRUFBTSxTQUFBO01BQ0wsSUFBRyxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFsQjtBQUNDLGVBQU8sTUFBQSxHQUFTLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBRGhDO09BQUEsTUFBQTtBQUdDLGVBQU8sSUFBQyxDQUFBLElBQUksQ0FBQyxNQUhkOztJQURLLENBSk47R0FmZ0I7RUE0QmpCLE9BQUEsRUFDQztJQUFBLE1BQUEsRUFBTyxTQUFDLEdBQUQ7O0FBQ047Ozs7YUFJSSxJQUFBLFFBQUEsQ0FBUztRQUNaLEdBQUEsRUFBSyxlQURPO1FBRVosTUFBQSxFQUNDO1VBQUEsR0FBQSxFQUFLLFFBQUw7VUFDQSxLQUFBLEVBQU8sVUFEUDtTQUhXO09BQVQsQ0FLSCxDQUFDLE1BTEUsQ0FLSyxRQUFRLENBQUMsY0FBVCxDQUF3QixhQUF4QixDQUFzQyxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBTGxELENBTUgsQ0FBQyxRQU5FLENBTU8sU0FBQyxJQUFEO2VBQVEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxJQUFJLENBQUMsUUFBakI7TUFBUixDQU5QLENB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O1VBQ0EsS0FBQSxDQUFNLElBQUksQ0FBQyxTQUFMLElBQWtCLElBQUksQ0FBQyxVQUF2QixJQUFxQyxJQUFJLENBQUMsVUFBaEQ7aUJBQ0EsV0FBQSxDQUFBO1FBSEssQ0FqQk07T0FBVCxDQXFCRixDQUFDLEdBckJDLENBQUEsRUFKTDtLQUFBLE1BQUE7TUEyQkMsV0FBQSxDQUFBLEVBM0JEOztFQUZPLENBeEdTO0VBMklqQixJQUFBLEVBQ0M7SUFBQSxPQUFBLEVBQ0M7TUFBQSxVQUFBLEVBQVksU0FBQyxLQUFEO2VBQVcsS0FBSyxDQUFDO01BQWpCLENBQVo7S0FERDtJQUdBLE9BQUEsRUFDQztNQUFBLFdBQUEsRUFBYSxTQUFDLEtBQUQ7ZUFDWixLQUFLLENBQUMsUUFBTixDQUFlLFVBQWY7TUFEWSxDQUFiO0tBSkQ7R0E1SWdCO0NBQVgiLCJmaWxlIjoiY29tcG9uZW50cy9mb3JtLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiIyMjKlxuICogREFTSEJPQVJEIFxuICogQGF1dGhvciBNZW5nIEcuXG4gKiBAZGVzY3JpcHRpb24gcGFydCBvZiBTUUlQXG4gKlxuICogQHJlcXVpcmVzIHN0b3JlXG4gKiBAcmVxdWlyZXMgdnVlLCB2dWV4LCByZXF1ZXN0c1xuIyMjXG5cbiMjIypcbiAqIOihqOWNlSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuIyMjXG5cbl9fZm9ybV90cGwgPSAnJydcblx0PGRpdiBjbGFzcz1cImNvbC1zbS05IGNvbC1zbS1vZmZzZXQtMyBjb2wtbWQtMTAgY29sLW1kLW9mZnNldC0yIG1haW4gZ20tZm9ybS13cmFwcGVyXCI+XG5cdFx0PGgyIGNsYXNzPVwic3ViLWhlYWRlclwiPnt7dGl0bGV9fTwvaDI+XG5cdFx0PGZvcm0gY2xhc3M9XCJmb3JtLWhvcml6b250YWwgZ20tZm9ybVwiPlxuXG5cdFx0XHQ8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiIHYtZm9yPVwiaW5wdXQgaW4gc3RydS5pbnB1dHNcIj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImlucHV0LWdyb3VwXCI+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImlucHV0LWdyb3VwLWFkZG9uXCI+e3t7aW5wdXRbMF19fX08L2Rpdj5cblx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIDpuYW1lPVwiaW5wdXRbMV1cIiB2LW1vZGVsPVwiZmQuaW5wdXRzWyRpbmRleF1cIj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblxuXG5cdFx0XHQ8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiIHYtZm9yPVwidGV4dCBpbiBzdHJ1LnRleHRzXCI+XG5cdFx0XHRcdDxsYWJlbD57e3t0ZXh0WzBdfX19PC9sYWJlbD5cblx0XHRcdFx0PHRleHRhcmVhIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgcm93cz1cIjNcIiA6bmFtZT1cInRleHRbMV1cIiB2LW1vZGVsPVwiZmQudGV4dHNbJGluZGV4XVwiPjwvdGV4dGFyZWE+XG5cdFx0XHQ8L2Rpdj5cblxuXHRcdFx0PGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIiB2LWlmPVwic3RydS5pbWdcIj5cblx0XHRcdFx0PGxhYmVsPnt7e3N0cnUuaW1nWzBdfX19PC9sYWJlbD5cblx0XHRcdFx0PGRpdiBpZD1cImltZ19idG5fd3JhcHBlclwiPlxuXHRcdFx0XHRcdDxpbnB1dCBpZD1cImltZ19jaG9vc2VuXCIgdHlwZT1cImZpbGVcIiBAY2hhbmdlPVwidXBsb2FkKClcIj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxpbnB1dCBpZD1cImltZ191cGxvYWRlZFwiIHR5cGU9XCJ0ZXh0XCIgOm5hbWU9XCJzdHJ1LmltZ1sxXVwiPlxuXHRcdFx0XHQ8aW1nIDpzcmM9XCJmZC5pbWdcIiBpZD1cImltZ190aHVtYlwiIGNsYXNzPVwiaW1nLXRodW1ibmFpbFwiPlxuXHRcdFx0PC9kaXY+XG5cdFx0XHRcblx0XHRcdDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIiBAY2xpY2s9XCJzZW5kXCI+U3VibWl0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHQ8L2Zvcm0+XG5cdDwvZGl2PlxuJycnXG5cbkZvcm0gPSBWdWUuZXh0ZW5kIHtcblx0bmFtZTogJ2Zvcm0nXG5cblx0dGVtcGxhdGU6IF9fZm9ybV90cGxcblxuXHRkYXRhOlxuXHRcdCgpLT5cblx0XHRcdHJldHVybntcblx0XHRcdFx0ZmQ6XG5cdFx0XHRcdFx0aW5wdXRzOltdXG5cdFx0XHRcdFx0dGV4dHM6W11cblx0XHRcdFx0XHRpbWc6XCJcIlxuXHRcdFx0fVxuXG5cdGNvbXB1dGVkOlxuXHRcdHN0cnU6KCktPiBcblx0XHRcdCMg6KGo5Y2V57uT5p6EXG5cdFx0XHRyZXR1cm4gQCRyb3V0ZS5zdHJ1XG5cblx0XHR0aXRsZTooKS0+XG5cdFx0XHRpZiBAJHJvdXRlLnBhcmFtcy5pZFxuXHRcdFx0XHRyZXR1cm4gJ+e8lui+kTogJyArIEAkcm91dGUucGFyYW1zLmlkXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJldHVybiBAc3RydS50aXRsZVxuXG5cblx0XHRcdFxuXG5cdG1ldGhvZHM6XG5cdFx0dXBsb2FkOihlbGUpLT5cblx0XHRcdCMjIypcblx0XHRcdCAqIOS4iuS8oOaWh+S7tu+8jOS8oOWFpWlucHV0W3R5cGU9ZmlsZV3oioLngrlcblx0XHRcdCAqIEBwYXJhbSBlbGUge0RvbSBlbGVtZW50fVxuXHRcdFx0IyMjXG5cdFx0XHRuZXcgUmVxdWVzdHMoe1xuXHRcdFx0XHR1cmw6IF9TVEFUSUNfU0VSVkVSX1xuXHRcdFx0XHRwYXJhbXM6XG5cdFx0XHRcdFx0dWlkOiAneWF5YXlhJ1xuXHRcdFx0XHRcdHRva2VuOiAnaG91aG9odW8nfSlcblx0XHRcdFx0LnVwbG9hZCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW1nX2Nob29zZW4nKS5maWxlc1swXVxuXHRcdFx0XHQucHJvZ3Jlc3MgKGFyZ3MpLT5jb25zb2xlLmxvZyBhcmdzLnByb2dyZXNzXG5cdFx0XHRcdC5sb2FkIChhcmdzKT0+XG5cdFx0XHRcdFx0QGZkLmltZyA9IF9TVEFUSUNfU0VSVkVSXyArIGFyZ3Mua2V5XG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ltZ191cGxvYWRlZCcpLnZhbHVlID0gX1NUQVRJQ19TRVJWRVJfICsgYXJncy5rZXlcblx0XHRcdFx0IyAubG9hZCAoYXJncyktPmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbWdfdXBsb2FkZWQnKS52YWx1ZSA9IF9TVEFUSUNfU0VSVkVSXyArIGFyZ3Mua2V5XG5cblx0XHRzZW5kOigpLT5cblx0XHRcdCMjIypcblx0XHRcdCAqIOihqOWNleWPkemAgVxuXHRcdFx0ICog6aqM6K+B5omA5pyJ6aG56Z2e56m6XG5cdFx0XHQjIyNcblx0XHRcdGZvcm0gPSB7fVxuXG5cdFx0XHRmb3IgaXRlbSwgX2luZGV4IGluIEBzdHJ1LmlucHV0c1xuXHRcdFx0XHRmb3JtW2l0ZW1bMV1dID0gQGZkLmlucHV0c1tfaW5kZXhdXG5cblx0XHRcdGZvciBpdGVtLCBfaW5kZXggaW4gQHN0cnUudGV4dHNcblx0XHRcdFx0Zm9ybVtpdGVtWzFdXSA9IEBmZC50ZXh0c1tfaW5kZXhdXG5cblx0XHRcdGlmIEBzdHJ1LmltZ1xuXHRcdFx0XHRmb3JtW0BzdHJ1LmltZ1sxXV0gPSBAZmQuaW1nXG5cblx0XHRcdGZvciBrLHYgb2YgZm9ybVxuXHRcdFx0XHRpZiB2ID09IHVuZGVmaW5lZCBvciB2ID09IG51bGwgb3IgdiA9PSAnJ1xuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgJ1dST05HIEFSR1M6JywgaywgdlxuXHRcdFx0XHRcdHJldHVyblxuXG5cdFx0XHRjb25zb2xlLmxvZyBmb3JtXG5cblx0XHRcdGJhY2sgPSBAc3RydS5iYWNrXG5cblx0XHRcdGlmIEAkcm91dGUucGFyYW1zLmlkICMg57yW6L6RXG5cdFx0XHRcdG5ldyBSZXF1ZXN0cyh7XG5cdFx0XHRcdFx0dXJsOiBfQVBJX1NFUlZFUl8gKyBAc3RydS5wYXRoICsgQCRyb3V0ZS5wYXJhbXMuaWRcblx0XHRcdFx0XHRwYXJhbXM6XG5cdFx0XHRcdFx0XHR1aWQ6IGdldENvb2tpZSAndWlkJ1xuXHRcdFx0XHRcdFx0dG9rZW46IGdldENvb2tpZSAndG9rZW4nXG5cdFx0XHRcdFx0Zm9ybTpmb3JtXG5cdFx0XHRcdFx0bG9hZDooYXJncyktPlxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2cgYXJnc1xuXHRcdFx0XHRcdFx0cm91dGVyLmdvIHtwYXRoOmJhY2t9XG5cdFx0XHRcdFx0ZXJyb3I6KGFyZ3MpLT5cblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgYXJnc1xuXHRcdFx0XHRcdFx0YWxlcnQgYXJncy5lcnJvcl9tc2cgfHwgYXJncy5lcnJvcl9pbmZvIHx8IGFyZ3MuZXJyb3JfY29kZVxuXHRcdFx0XHRcdFx0cHJvX2Jhcl9lbmQoKVxuXHRcdFx0XHRcdH0pLnB1dCgpXG5cblx0XHRcdGVsc2Vcblx0XHRcdFx0bmV3IFJlcXVlc3RzKHtcblx0XHRcdFx0XHR1cmw6IF9BUElfU0VSVkVSXyArIEBzdHJ1LnBhdGhcblx0XHRcdFx0XHRwYXJhbXM6XG5cdFx0XHRcdFx0XHR1aWQ6ICd5YXlheWEnXG5cdFx0XHRcdFx0XHR0b2tlbjogJ2hvdWhvaHVvJ1xuXHRcdFx0XHRcdGZvcm06Zm9ybVxuXHRcdFx0XHRcdGxvYWQ6KGFyZ3MpLT5cblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nIGFyZ3Ncblx0XHRcdFx0XHRcdHJvdXRlci5nbyB7cGF0aDpiYWNrfVxuXHRcdFx0XHRcdGVycm9yOihhcmdzKS0+XG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIGFyZ3Ncblx0XHRcdFx0XHRcdGFsZXJ0IGFyZ3MuZXJyb3JfbXNnIHx8IGFyZ3MuZXJyb3JfaW5mbyB8fCBhcmdzLmVycm9yX2NvZGVcblx0XHRcdFx0XHRcdHByb19iYXJfZW5kKClcblx0XHRcdFx0XHR9KS5wb3N0KClcblxuXG5cdGNyZWF0ZWQ6KCktPlxuXHRcdGNvbnNvbGUubG9nICdjcmVhdGVkJywgQCRyb3V0ZS5wYXJhbXMuaWRcblx0XHRpZiBAJHJvdXRlLnBhcmFtcy5pZCAjIOW9k+WJjemhtemdouS4uue8lui+kemhtemdolxuXHRcdFx0IyBfX2ZkID0gQGZkXG5cdFx0XHQjIEBmZCA9IHtpbnB1dHM6WzEsMiwzLDQsNSw2LDcsOF0sIHRleHRzOlsxMiwzNF0sIGltZzpcIlwifVxuXHRcdFx0IyDojrflj5blvZPliY3nvJbovpHlr7nosaHnmoTnjrDmnInkv6Hmga9cblx0XHRcdG5ldyBSZXF1ZXN0cyh7XG5cdFx0XHRcdHVybDogX0FQSV9TRVJWRVJfICsgQHN0cnUucGF0aCArIEAkcm91dGUucGFyYW1zLmlkXG5cdFx0XHRcdGxvYWQ6KGFyZ3MpPT5cblx0XHRcdFx0XHRjb25zb2xlLmxvZyBhcmdzXG5cblx0XHRcdFx0XHRmb3IgaXRlbSBpbiBAc3RydS5pbnB1dHNcblx0XHRcdFx0XHRcdEBmZC5pbnB1dHMucHVzaCBhcmdzWydwcm8nXVtpdGVtWzFdXVxuXG5cdFx0XHRcdFx0Zm9yIGl0ZW0sIF9pbmRleCBpbiBAc3RydS50ZXh0c1xuXHRcdFx0XHRcdFx0QGZkLnRleHRzLnB1c2ggYXJnc1sncHJvJ11baXRlbVsxXV1cblxuXHRcdFx0XHRcdGlmIEBzdHJ1LmltZ1xuXHRcdFx0XHRcdFx0QGZkLmltZyA9IGFyZ3NbJ3BybyddLmltZ1xuXG5cdFx0XHRcdFx0IyDov5vluqbmnaFcblx0XHRcdFx0XHRwcm9fYmFyX2VuZCgpXG5cblx0XHRcdFx0ZXJyb3I6KGFyZ3MpLT5cblx0XHRcdFx0XHRjb25zb2xlLmVycm9yIGFyZ3Ncblx0XHRcdFx0XHRhbGVydCBhcmdzLmVycm9yX21zZyB8fCBhcmdzLmVycm9yX2luZm8gfHwgYXJncy5lcnJvcl9jb2RlXG5cdFx0XHRcdFx0cHJvX2Jhcl9lbmQoKVxuXHRcdFx0fSkuZ2V0KClcblx0XHRlbHNlXG5cdFx0XHRwcm9fYmFyX2VuZCgpXG5cdFx0cmV0dXJuXG5cdFx0XHRcblxuXG5cblx0dnVleDpcblx0XHRnZXR0ZXJzOlxuXHRcdFx0ZWRpdF9zdGF0ZTogKHN0YXRlKSAtPiBzdGF0ZS5lZGl0X3N0YXRlXG5cblx0XHRhY3Rpb25zOlxuXHRcdFx0ZmluaXNoX2VkaXQ6IChzdG9yZSkgLT5cblx0XHRcdFx0c3RvcmUuZGlzcGF0Y2ggJ0VORF9FRElUJ1xufSJdfQ==
