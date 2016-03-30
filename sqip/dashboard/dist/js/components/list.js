
/**
 * DASHBOARD 
 * @author Meng G.
 * @description part of SQIP
 *
 * @requires store
 * @requires vue, vuex, requests
 */

/**
 * 列表 =======================================================================
 */
var List, __list_tpl;

__list_tpl = '<div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main gm-list">\n	<h2 class="sub-header">{{$route.stru.title}} <span v-link="{name:\'add\'}" class="gm-add btn btn-success" v-if="edit_show">新建</span></h2>\n	<div class="table-responsive">\n		<table class="table table-striped">\n			<thead>\n				<tr>\n					<th v-for="item in $route.stru.th">{{item}}</th>\n				</tr>\n			</thead>\n			<tbody>\n				<tr v-for="item in list">\n					<td v-for="td in $route.stru.td">{{item[td]}}</td>\n					<td v-if="edit_show">\n						<span @click="edit(item.id)" class="glyphicon glyphicon-edit" aria-hidden="true"></span>\n						<span @click="del(item.id)" class="glyphicon glyphicon-remove-circle" aria-hidden="true"></span>\n					</td>\n				</tr>\n			</tbody>\n		</table>\n\n		<nav>\n			<ul class="pagination">\n				<li>\n					<a v-on:click="prev_page" aria-label="Previous">\n						<span aria-hidden="true">&laquo;</span>\n					</a>\n				</li>\n				<li v-if="max_page <=10 " v-for="page in max_page" v-on:click="goto_page(page+1)" :class="!this.page_curr(page) || \'active\'"><a>{{page+1}}</a></li>\n				<li v-if="max_page > 10 " \'active\'><a>{{page}}/{{max_page}}</a></li>\n				<li>\n					<a v-on:click="next_page" aria-label="Next">\n						<span aria-hidden="true">&raquo;</span>\n					</a>\n				</li>\n			</ul>\n		</nav>\n\n	</div>\n</div>';

List = Vue.extend({
  name: 'projects',
  template: __list_tpl,
  data: function() {
    return {
      size: 7,
      list: [],
      page: 1,
      max_page: 0
    };
  },
  computed: {
    edit_show: function() {
      return this.$route.stru.th.length > this.$route.stru.td.length;
    }
  },
  methods: {
    page_curr: function(page_c) {
      return (page_c + 1) === this.page;
    },
    next_page: function() {
      return this.goto_page(this.page + 1);
    },
    prev_page: function() {
      return this.goto_page(this.page - 1);
    },
    goto_page: function(page) {
      if (page === this.page) {
        return;
      }
      if (page > this.max_page) {
        console.warn('MAX PAGE!!!');
        return;
      }
      if (page < 1) {
        console.warn('PAGE ! ALREADY');
        return;
      }
      this.page = page;
      return this.refresh_list();
    },
    refresh_list: function() {
      var url;
      console.log('refreshing page:', this.page);
      pro_bar_start();
      url = this.$route.stru.makeUrl({
        page: this.page,
        size: this.size
      });
      new Requests(url).get().load((function(_this) {
        return function(args) {
          console.log("loaded");
          _this.max_page = args.max_page || 1;
          _this.list = args[_this.$route.stru.list_key];
          return pro_bar_end();
        };
      })(this)).error((function(_this) {
        return function(args) {
          alert(args.error_msg || args.error_info || args.error_code);
          return pro_bar_end();
        };
      })(this));
    },
    edit: function(id) {
      console.log(id);
      this.patch_edite(id);
      return router.go({
        name: 'edit',
        params: {
          id: id
        }
      });
    },
    del: function(id) {
      console.log(id);
      return new Requests({
        url: this.$route.stru.delURL(id),
        params: {
          uid: getCookie('uid'),
          token: getCookie('token')
        },
        load: (function(_this) {
          return function(args) {
            return _this.refresh_list();
          };
        })(this),
        error: function(args) {
          console.error(args);
          if (args.error_code === "pm_admin") {
            return redirect('/login.html');
          } else {
            alert(args.error_msg || args.error_info || args.error_code);
            return pro_bar_end();
          }
        }
      })["delete"]();
    }
  },
  created: function() {
    console.log("created");
    this.refresh_list(this.page);
  },
  vuex: {
    actions: {
      patch_edite: function(store, id) {
        console.log('PATCHED', id);
        return store.dispatch('PATCH_EDIT');
      }
    }
  },
  route: {
    canReuse: false
  }
});

//# sourceMappingURL=data:application/json;base64,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LE9BQU8sQ0FBQyxHQUFSLENBQVksU0FBWixFQUF1QixFQUF2QjtlQUVBLEtBQUssQ0FBQyxRQUFOLENBQWUsWUFBZjtNQUhZLENBQWI7S0FERDtHQTlGZ0I7RUFvR2pCLEtBQUEsRUFDQztJQUFBLFFBQUEsRUFBUyxLQUFUO0dBckdnQjtDQUFYIiwiZmlsZSI6ImNvbXBvbmVudHMvbGlzdC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbIiMjIypcbiAqIERBU0hCT0FSRCBcbiAqIEBhdXRob3IgTWVuZyBHLlxuICogQGRlc2NyaXB0aW9uIHBhcnQgb2YgU1FJUFxuICpcbiAqIEByZXF1aXJlcyBzdG9yZVxuICogQHJlcXVpcmVzIHZ1ZSwgdnVleCwgcmVxdWVzdHNcbiMjI1xuXG4jIyMqXG4gKiDliJfooaggPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiMjI1xuXG5cbl9fbGlzdF90cGwgPSAnJydcblx0PGRpdiBjbGFzcz1cImNvbC1zbS05IGNvbC1zbS1vZmZzZXQtMyBjb2wtbWQtMTAgY29sLW1kLW9mZnNldC0yIG1haW4gZ20tbGlzdFwiPlxuXHRcdDxoMiBjbGFzcz1cInN1Yi1oZWFkZXJcIj57eyRyb3V0ZS5zdHJ1LnRpdGxlfX0gPHNwYW4gdi1saW5rPVwie25hbWU6J2FkZCd9XCIgY2xhc3M9XCJnbS1hZGQgYnRuIGJ0bi1zdWNjZXNzXCIgdi1pZj1cImVkaXRfc2hvd1wiPuaWsOW7ujwvc3Bhbj48L2gyPlxuXHRcdDxkaXYgY2xhc3M9XCJ0YWJsZS1yZXNwb25zaXZlXCI+XG5cdFx0XHQ8dGFibGUgY2xhc3M9XCJ0YWJsZSB0YWJsZS1zdHJpcGVkXCI+XG5cdFx0XHRcdDx0aGVhZD5cblx0XHRcdFx0XHQ8dHI+XG5cdFx0XHRcdFx0XHQ8dGggdi1mb3I9XCJpdGVtIGluICRyb3V0ZS5zdHJ1LnRoXCI+e3tpdGVtfX08L3RoPlxuXHRcdFx0XHRcdDwvdHI+XG5cdFx0XHRcdDwvdGhlYWQ+XG5cdFx0XHRcdDx0Ym9keT5cblx0XHRcdFx0XHQ8dHIgdi1mb3I9XCJpdGVtIGluIGxpc3RcIj5cblx0XHRcdFx0XHRcdDx0ZCB2LWZvcj1cInRkIGluICRyb3V0ZS5zdHJ1LnRkXCI+e3tpdGVtW3RkXX19PC90ZD5cblx0XHRcdFx0XHRcdDx0ZCB2LWlmPVwiZWRpdF9zaG93XCI+XG5cdFx0XHRcdFx0XHRcdDxzcGFuIEBjbGljaz1cImVkaXQoaXRlbS5pZClcIiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tZWRpdFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0PHNwYW4gQGNsaWNrPVwiZGVsKGl0ZW0uaWQpXCIgY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLXJlbW92ZS1jaXJjbGVcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+XG5cdFx0XHRcdFx0XHQ8L3RkPlxuXHRcdFx0XHRcdDwvdHI+XG5cdFx0XHRcdDwvdGJvZHk+XG5cdFx0XHQ8L3RhYmxlPlxuXG5cdFx0XHQ8bmF2PlxuXHRcdFx0XHQ8dWwgY2xhc3M9XCJwYWdpbmF0aW9uXCI+XG5cdFx0XHRcdFx0PGxpPlxuXHRcdFx0XHRcdFx0PGEgdi1vbjpjbGljaz1cInByZXZfcGFnZVwiIGFyaWEtbGFiZWw9XCJQcmV2aW91c1wiPlxuXHRcdFx0XHRcdFx0XHQ8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mbGFxdW87PC9zcGFuPlxuXHRcdFx0XHRcdFx0PC9hPlxuXHRcdFx0XHRcdDwvbGk+XG5cdFx0XHRcdFx0PGxpIHYtaWY9XCJtYXhfcGFnZSA8PTEwIFwiIHYtZm9yPVwicGFnZSBpbiBtYXhfcGFnZVwiIHYtb246Y2xpY2s9XCJnb3RvX3BhZ2UocGFnZSsxKVwiIDpjbGFzcz1cIiF0aGlzLnBhZ2VfY3VycihwYWdlKSB8fCAnYWN0aXZlJ1wiPjxhPnt7cGFnZSsxfX08L2E+PC9saT5cblx0XHRcdFx0XHQ8bGkgdi1pZj1cIm1heF9wYWdlID4gMTAgXCIgJ2FjdGl2ZSc+PGE+e3twYWdlfX0ve3ttYXhfcGFnZX19PC9hPjwvbGk+XG5cdFx0XHRcdFx0PGxpPlxuXHRcdFx0XHRcdFx0PGEgdi1vbjpjbGljaz1cIm5leHRfcGFnZVwiIGFyaWEtbGFiZWw9XCJOZXh0XCI+XG5cdFx0XHRcdFx0XHRcdDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZyYXF1bzs8L3NwYW4+XG5cdFx0XHRcdFx0XHQ8L2E+XG5cdFx0XHRcdFx0PC9saT5cblx0XHRcdFx0PC91bD5cblx0XHRcdDwvbmF2PlxuXG5cdFx0PC9kaXY+XG5cdDwvZGl2PlxuJycnXG5cbkxpc3QgPSBWdWUuZXh0ZW5kIHtcblxuXHRuYW1lOiAncHJvamVjdHMnXG5cblxuXHR0ZW1wbGF0ZTogX19saXN0X3RwbFxuXG5cdGRhdGE6ICgpLT5cblx0XHRyZXR1cm4ge1xuXHRcdFx0c2l6ZTo3XG5cdFx0XHRsaXN0OltdXG5cdFx0XHRwYWdlOjFcblx0XHRcdG1heF9wYWdlOjBcblx0XHR9XG5cblx0Y29tcHV0ZWQ6XG5cdFx0ZWRpdF9zaG93OigpLT5cblx0XHRcdHJldHVybiAoQCRyb3V0ZS5zdHJ1LnRoLmxlbmd0aCA+IEAkcm91dGUuc3RydS50ZC5sZW5ndGgpXG5cblx0bWV0aG9kczpcblx0XHRwYWdlX2N1cnI6IChwYWdlX2MpLT5cblx0XHRcdHJldHVybiAocGFnZV9jICsgMSkgPT0gQHBhZ2VcblxuXHRcdG5leHRfcGFnZTogKCktPlxuXHRcdFx0QGdvdG9fcGFnZShAcGFnZSsxKVxuXG5cdFx0cHJldl9wYWdlOiAoKS0+XG5cdFx0XHRAZ290b19wYWdlKEBwYWdlLTEpXG5cblx0XHRnb3RvX3BhZ2U6IChwYWdlKS0+XG5cdFx0XHRpZiBwYWdlID09IEBwYWdlXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0aWYgcGFnZSA+IEBtYXhfcGFnZVxuXHRcdFx0XHRjb25zb2xlLndhcm4gJ01BWCBQQUdFISEhJ1xuXHRcdFx0XHRyZXR1cm5cblx0XHRcdGlmIHBhZ2UgPCAxXG5cdFx0XHRcdGNvbnNvbGUud2FybiAnUEFHRSAhIEFMUkVBRFknXG5cdFx0XHRcdHJldHVyblxuXG5cdFx0XHRAcGFnZSA9IHBhZ2Vcblx0XHRcdEByZWZyZXNoX2xpc3QoKVxuXG5cblx0XHRyZWZyZXNoX2xpc3Q6ICgpLT5cblx0XHRcdGNvbnNvbGUubG9nICdyZWZyZXNoaW5nIHBhZ2U6JywgQHBhZ2Vcblx0XHRcdHByb19iYXJfc3RhcnQoKVxuXHRcdFx0dXJsID0gQCRyb3V0ZS5zdHJ1Lm1ha2VVcmwge3BhZ2U6QHBhZ2UsIHNpemU6QHNpemV9XG5cdFx0XHRuZXcgUmVxdWVzdHModXJsKS5nZXQoKVxuXHRcdFx0XHQubG9hZCAoYXJncyk9PiBcblx0XHRcdFx0XHRjb25zb2xlLmxvZyBcImxvYWRlZFwiXG5cdFx0XHRcdFx0QG1heF9wYWdlID0gYXJncy5tYXhfcGFnZSB8fCAxXG5cdFx0XHRcdFx0QGxpc3QgPSBhcmdzW0Akcm91dGUuc3RydS5saXN0X2tleV1cblx0XHRcdFx0XHQjIOi/m+W6puadoVxuXHRcdFx0XHRcdHByb19iYXJfZW5kKClcblx0XHRcdFx0LmVycm9yIChhcmdzKT0+XG5cdFx0XHRcdFx0YWxlcnQgYXJncy5lcnJvcl9tc2cgfHwgYXJncy5lcnJvcl9pbmZvIHx8IGFyZ3MuZXJyb3JfY29kZVxuXHRcdFx0XHRcdHByb19iYXJfZW5kKClcblx0XHRcdHJldHVybiBcblxuXHRcdGVkaXQ6IChpZCktPlxuXHRcdFx0Y29uc29sZS5sb2cgaWRcblx0XHRcdEBwYXRjaF9lZGl0ZShpZClcblxuXHRcdFx0cm91dGVyLmdvIHtcblx0XHRcdFx0bmFtZTogJ2VkaXQnXG5cdFx0XHRcdHBhcmFtczoge2lkOmlkfVxuXHRcdFx0fVxuXG5cdFx0ZGVsOiAoaWQpLT5cblx0XHRcdGNvbnNvbGUubG9nIGlkXG5cblx0XHRcdG5ldyBSZXF1ZXN0cyh7XG5cdFx0XHRcdHVybDogQCRyb3V0ZS5zdHJ1LmRlbFVSTCBpZFxuXHRcdFx0XHRwYXJhbXM6XG5cdFx0XHRcdFx0dWlkOiBnZXRDb29raWUgJ3VpZCdcblx0XHRcdFx0XHR0b2tlbjogZ2V0Q29va2llICd0b2tlbidcblx0XHRcdFx0bG9hZDooYXJncyk9PlxuXHRcdFx0XHRcdEByZWZyZXNoX2xpc3QoKVxuXHRcdFx0XHRlcnJvcjooYXJncyktPlxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgYXJnc1xuXHRcdFx0XHRcdGlmIGFyZ3MuZXJyb3JfY29kZSA9PSBcInBtX2FkbWluXCJcblx0XHRcdFx0XHRcdHJlZGlyZWN0ICcvbG9naW4uaHRtbCdcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRhbGVydCBhcmdzLmVycm9yX21zZyB8fCBhcmdzLmVycm9yX2luZm8gfHwgYXJncy5lcnJvcl9jb2RlXG5cdFx0XHRcdFx0XHRwcm9fYmFyX2VuZCgpXG5cdFx0XHRcdH0pLmRlbGV0ZSgpXG5cblxuXHRjcmVhdGVkOiAoKS0+XG5cdFx0Y29uc29sZS5sb2cgXCJjcmVhdGVkXCJcblx0XHRAcmVmcmVzaF9saXN0IEBwYWdlXG5cdFx0cmV0dXJuXG5cblx0dnVleDpcblx0XHRhY3Rpb25zOlxuXHRcdFx0cGF0Y2hfZWRpdGU6IChzdG9yZSwgaWQpIC0+XG5cdFx0XHRcdGNvbnNvbGUubG9nICdQQVRDSEVEJywgaWRcblx0XHRcdFx0IyBwYXRjaFxuXHRcdFx0XHRzdG9yZS5kaXNwYXRjaCAnUEFUQ0hfRURJVCdcblxuXHRyb3V0ZTogXG5cdFx0Y2FuUmV1c2U6ZmFsc2Vcbn0iXX0=
