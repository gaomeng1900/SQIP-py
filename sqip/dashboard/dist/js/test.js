var App_r, Bar, Baz, Foo, app, router, store;

Vue.config.debug = true;

Vue.use(Vuex);

store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    INCREMENT: function(state) {
      return state.count++;
    }
  }
});

app = new Vue({
  el: '#test',
  template: '<div >\n	Clicked: {{ count }} times\n	<button v-on:click="increment">+</button>\n</div>',
  store: store,
  vuex: {
    getters: {
      count: (function(_this) {
        return function(state) {
          return state.count;
        };
      })(this)
    },
    actions: {
      increment: (function(_this) {
        return function(store) {
          return store.dispatch('INCREMENT');
        };
      })(this)
    }
  }
});

Foo = Vue.extend({
  template: '<div class="foo">\n	<h2>This is Foo!</h2>\n	<router-view></router-view>\n</div>'
});

Bar = Vue.extend({
  template: '<p>This is bar! </p>\n<p>{{path}}</p>\n<p>{{$route.params}}</p>\n<p>{{$route.query}}</p>',
  computed: {
    path: function() {
      return this.$route.path;
    }
  }
});

Baz = Vue.extend({
  template: '<p>This is baz! {{$route.params.param}}</p>'
});

router = new VueRouter({});

router.map({
  '/foo': {
    component: Foo,
    subRoutes: {
      '/': {
        component: {
          template: '<p> default {{$route.path}} </p>'
        }
      },
      '/bar': {
        component: Bar
      },
      '/baz/:param': {
        component: Baz
      }
    }
  }
});

App_r = Vue.extend({
  template: '<div>\n	<h1>Hello App!</h1>\n	<p>\n		<div v-link="{ path: \'/foo\' }"><a>Go to /foo</a></div>\n		<a v-link="{ path: \'/foo/bar\' }">Go to /foo/bar</a>\n		<a v-link="{ path: \'/foo/baz/youyou\' }">Go to /foo/baz</a>\n	</p>\n	<router-view></router-view>\n</div>'
});

router.start(App_r, '#app');

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUE7O0FBQUEsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFYLEdBQW1COztBQUVuQixHQUFHLENBQUMsR0FBSixDQUFRLElBQVI7O0FBSUEsS0FBQSxHQUFZLElBQUEsSUFBSSxDQUFDLEtBQUwsQ0FBVztFQUN0QixLQUFBLEVBQ0M7SUFBQSxLQUFBLEVBQU0sQ0FBTjtHQUZxQjtFQUl0QixTQUFBLEVBQ0M7SUFBQSxTQUFBLEVBQVcsU0FBQyxLQUFEO2FBQ1YsS0FBSyxDQUFDLEtBQU47SUFEVSxDQUFYO0dBTHFCO0NBQVg7O0FBeURaLEdBQUEsR0FBVSxJQUFBLEdBQUEsQ0FBSTtFQUNiLEVBQUEsRUFBSSxPQURTO0VBRWIsUUFBQSxFQUFTLHlGQUZJO0VBUWIsT0FBQSxLQVJhO0VBU2IsSUFBQSxFQUNDO0lBQUEsT0FBQSxFQUNDO01BQUEsS0FBQSxFQUFPLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxLQUFEO2lCQUFXLEtBQUssQ0FBQztRQUFqQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBUDtLQUREO0lBR0EsT0FBQSxFQUNDO01BQUEsU0FBQSxFQUFXLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxLQUFEO2lCQUNWLEtBQUssQ0FBQyxRQUFOLENBQWUsV0FBZjtRQURVO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFYO0tBSkQ7R0FWWTtDQUFKOztBQXFCVixHQUFBLEdBQU0sR0FBRyxDQUFDLE1BQUosQ0FBVztFQUNoQixRQUFBLEVBQVUsaUZBRE07Q0FBWDs7QUFTTixHQUFBLEdBQU0sR0FBRyxDQUFDLE1BQUosQ0FBVztFQUNoQixRQUFBLEVBQVUsMEZBRE07RUFXaEIsUUFBQSxFQUNDO0lBQUEsSUFBQSxFQUFNLFNBQUE7YUFDTCxJQUFDLENBQUEsTUFBTSxDQUFDO0lBREgsQ0FBTjtHQVplO0NBQVg7O0FBZ0JOLEdBQUEsR0FBTSxHQUFHLENBQUMsTUFBSixDQUFXO0VBQ2hCLFFBQUEsRUFBVSw2Q0FETTtDQUFYOztBQUtOLE1BQUEsR0FBYSxJQUFBLFNBQUEsQ0FBVSxFQUFWOztBQUViLE1BQU0sQ0FBQyxHQUFQLENBQVc7RUFDVixNQUFBLEVBQ0M7SUFBQSxTQUFBLEVBQVcsR0FBWDtJQUVBLFNBQUEsRUFDQztNQUFBLEdBQUEsRUFDQztRQUFBLFNBQUEsRUFDQztVQUFBLFFBQUEsRUFBVSxrQ0FBVjtTQUREO09BREQ7TUFLQSxNQUFBLEVBQ0M7UUFBQSxTQUFBLEVBQVcsR0FBWDtPQU5EO01BT0EsYUFBQSxFQUNDO1FBQUEsU0FBQSxFQUFXLEdBQVg7T0FSRDtLQUhEO0dBRlM7Q0FBWDs7QUFrQkEsS0FBQSxHQUFRLEdBQUcsQ0FBQyxNQUFKLENBQVc7RUFDbEIsUUFBQSxFQUFVLHFRQURRO0NBQVg7O0FBYVIsTUFBTSxDQUFDLEtBQVAsQ0FBYSxLQUFiLEVBQW9CLE1BQXBCIiwiZmlsZSI6InRlc3QuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJWdWUuY29uZmlnLmRlYnVnID0gdHJ1ZVxuXG5WdWUudXNlIFZ1ZXhcblxuXG5cbnN0b3JlID0gbmV3IFZ1ZXguU3RvcmUge1xuXHRzdGF0ZTpcblx0XHRjb3VudDoxXG5cblx0bXV0YXRpb25zOlxuXHRcdElOQ1JFTUVOVDogKHN0YXRlKS0+XG5cdFx0XHRzdGF0ZS5jb3VudCsrXG59XG5cblxuIyBNeUNvbXBvbmVudCA9IFZ1ZS5leHRlbmQge1xuIyBcdHRlbXBsYXRlOlwiPGRpdj57e3h9fTwvZGl2PlwiXG4jIFx0ZGF0YTogKCktPnt4OlwiWFhYXCJ9XG4jIFx0dnVleDpcbiMgXHRcdGdldHRlcnM6XG4jIFx0XHRcdGNvdW50OiAoc3RhdGUpPT5cbiMgXHRcdFx0XHRyZXR1cm4gc3RhdGUuY291bnRcblxuIyBcdFx0YWN0aW9uczpcbiMgXHRcdFx0aW5jcmVtZW50OiAoc3RvcmUpID0+XG4jIFx0XHRcdFx0c3RvcmUuZGlzcGF0Y2goJ0lOQ1JFTUVOVCcpXG4jIH1cblxuIyBWdWUuY29tcG9uZW50ICdteS1jb21wb25lbnQnLCBNeUNvbXBvbmVudFxuXG4jIGFwcCA9IG5ldyBWdWUge1xuIyBcdGVsOidib2R5J1xuIyBcdHN0b3JlXG4jIFx0Y29tcG9uZW50OlxuIyBcdFx0J215LWNvbXBvbmVudCc6XG4jIFx0XHRcdE15Q29tcG9uZW50XG4jIH1cblxuXG5cblxuIyB2bSA9IG5ldyBWdWUge1xuIyBcdHN0b3JlXG4jIFx0dnVleDpcbiMgXHRcdGdldHRlcnM6XG4jIFx0XHRcdGNvdW50OiAoc3RhdGUpPT5cbiMgXHRcdFx0XHRyZXR1cm4gc3RhdGUuY291bnRcblxuIyBcdFx0YWN0aW9uczpcbiMgXHRcdFx0aW5jcmVtZW50OiAoc3RvcmUpID0+XG4jIFx0XHRcdFx0c3RvcmUuZGlzcGF0Y2goJ0lOQ1JFTUVOVCcpXG4jIFx0fSBcblxuXG4jIDxkaXYgaWQ9XCJhcHBcIj5cbiMgXHRDbGlja2VkOiB7eyBjb3VudCB9fSB0aW1lc1xuIyBcdDxidXR0b24gdi1vbjpjbGljaz1cImluY3JlbWVudFwiPis8L2J1dHRvbj5cbiMgXHQ8YnV0dG9uIHYtb246Y2xpY2s9XCJkZWNyZW1lbnRcIj4tPC9idXR0b24+XG4jIDwvZGl2PlxuXG5cblxuYXBwID0gbmV3IFZ1ZSB7XG5cdGVsOiAnI3Rlc3QnXG5cdHRlbXBsYXRlOicnJ1xuXHRcdDxkaXYgPlxuXHRcdFx0Q2xpY2tlZDoge3sgY291bnQgfX0gdGltZXNcblx0XHRcdDxidXR0b24gdi1vbjpjbGljaz1cImluY3JlbWVudFwiPis8L2J1dHRvbj5cblx0XHQ8L2Rpdj5cblx0XHQnJydcblx0c3RvcmVcblx0dnVleDpcblx0XHRnZXR0ZXJzOlxuXHRcdFx0Y291bnQ6IChzdGF0ZSkgPT4gc3RhdGUuY291bnRcblxuXHRcdGFjdGlvbnM6XG5cdFx0XHRpbmNyZW1lbnQ6IChzdG9yZSkgPT5cblx0XHRcdFx0c3RvcmUuZGlzcGF0Y2ggJ0lOQ1JFTUVOVCdcblxufVxuXG5cbiMgZGVmaW5lIHNvbWUgY29tcG9uZW50c1xuRm9vID0gVnVlLmV4dGVuZCh7XG5cdHRlbXBsYXRlOiAnJydcblx0XHQ8ZGl2IGNsYXNzPVwiZm9vXCI+XG5cdFx0XHQ8aDI+VGhpcyBpcyBGb28hPC9oMj5cblx0XHRcdDxyb3V0ZXItdmlldz48L3JvdXRlci12aWV3PlxuXHRcdDwvZGl2PlxuXHRcdCcnJ1xufSlcblxuQmFyID0gVnVlLmV4dGVuZCh7XG5cdHRlbXBsYXRlOiAnJydcblx0XHQ8cD5UaGlzIGlzIGJhciEgPC9wPlxuXHRcdDxwPnt7cGF0aH19PC9wPlxuXHRcdDxwPnt7JHJvdXRlLnBhcmFtc319PC9wPlxuXHRcdDxwPnt7JHJvdXRlLnF1ZXJ5fX08L3A+XG5cdFx0JycnXG5cdCMgZGF0YTpcblx0XHQjIHBhdGg6JHJvdXRlLnBhdGhcblx0IyBcdHBhcmFtczpAJHJvdXRlLnBhcmFtc1xuXHQjIFx0cXVlcnk6JHJvdXRlLnF1ZXJ5XG5cdGNvbXB1dGVkOlxuXHRcdHBhdGg6ICgpLT5cblx0XHRcdEAkcm91dGUucGF0aFxufSlcblxuQmF6ID0gVnVlLmV4dGVuZCh7XG5cdHRlbXBsYXRlOiAnPHA+VGhpcyBpcyBiYXohIHt7JHJvdXRlLnBhcmFtcy5wYXJhbX19PC9wPidcbn0pXG5cbiMgY29uZmlndXJlIHJvdXRlclxucm91dGVyID0gbmV3IFZ1ZVJvdXRlcih7fSlcblxucm91dGVyLm1hcCB7XG5cdCcvZm9vJzpcblx0XHRjb21wb25lbnQ6IEZvb1xuXG5cdFx0c3ViUm91dGVzOlxuXHRcdFx0Jy8nOlxuXHRcdFx0XHRjb21wb25lbnQ6XG5cdFx0XHRcdFx0dGVtcGxhdGU6ICcnJ1xuXHRcdFx0XHRcdFx0PHA+IGRlZmF1bHQge3skcm91dGUucGF0aH19IDwvcD5cblx0XHRcdFx0XHQnJydcblx0XHRcdCcvYmFyJzpcblx0XHRcdFx0Y29tcG9uZW50OiBCYXJcblx0XHRcdCcvYmF6LzpwYXJhbSc6IFxuXHRcdFx0XHRjb21wb25lbnQ6IEJhelxuXG59XG5cbiMgc3RhcnQgYXBwXG5BcHBfciA9IFZ1ZS5leHRlbmQge1xuXHR0ZW1wbGF0ZTogJycnXG5cdFx0PGRpdj5cblx0XHRcdDxoMT5IZWxsbyBBcHAhPC9oMT5cblx0XHRcdDxwPlxuXHRcdFx0XHQ8ZGl2IHYtbGluaz1cInsgcGF0aDogJy9mb28nIH1cIj48YT5HbyB0byAvZm9vPC9hPjwvZGl2PlxuXHRcdFx0XHQ8YSB2LWxpbms9XCJ7IHBhdGg6ICcvZm9vL2JhcicgfVwiPkdvIHRvIC9mb28vYmFyPC9hPlxuXHRcdFx0XHQ8YSB2LWxpbms9XCJ7IHBhdGg6ICcvZm9vL2Jhei95b3V5b3UnIH1cIj5HbyB0byAvZm9vL2JhejwvYT5cblx0XHRcdDwvcD5cblx0XHRcdDxyb3V0ZXItdmlldz48L3JvdXRlci12aWV3PlxuXHRcdDwvZGl2PlxuXHQnJydcblx0fVxucm91dGVyLnN0YXJ0KEFwcF9yLCAnI2FwcCcpIl19
