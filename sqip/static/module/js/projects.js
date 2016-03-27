var projects_list_tpl, style;

console.log('projects');

Vue.config.debug = true;

projects_list_tpl = '<!-- <template id="projects-tpl"> -->\n<img class="sec_title" src="/static/img/projects.jpg">\n<div id="projects_wrapper">\n	<a class="card" href="/projects/{{pro.id}}" v-for="pro of pros" track-by="$index" transition="expand">\n		<div class="card_img" :style="{\'background-image\': \'url(\' + pro.img + \')\'}"></div>\n		<div class="card_info">\n			<div class="card_info_title">{{pro.pro_name}}</div>\n			<div class="card_info_content">\n				<span class="time"><i class="iconfont">&#58912;</i>{{pro.time}}</span>\n				<span class="place"><i class="iconfont">&#58886;</i>{{pro.place}}</span>\n			</div>\n		</div>\n	</a>\n	<div class="clear"></div>\n	<div id="rolling_tips">{{rolling_tips}}</div>\n</div>';

style = document.createElement('style');

style.innerHTML = '/* 必需 */\n.expand-transition {\n  transition: all .3s ease;\n  transform:scale(1,1);\n  opacity: 1;\n}\n\n/* .expand-enter 定义进入的开始状态 */\n/* .expand-leave 定义离开的结束状态 */\n.expand-enter, .expand-leave {\n  opacity: 0;\n  transform:scale(.7,.7);\n}';

document.getElementsByTagName('HEAD').item(0).appendChild(style);

Vue.component('projects', {
  template: projects_list_tpl,
  data: function() {
    return {
      pros: [],
      page_num: 1,
      max_page: 2,
      end_of_rolling: 0,
      rolling_tips: "....",
      time: 0,
      size: 6
    };
  },
  methods: {
    add_items: function() {
      var params;
      console.log("add_items ing ...");
      if (!this.end_of_rolling) {
        this.rolling_tips = "载入中....";
        return this.$http.get('/api/v1/projects', params = {
          page: this.page_num,
          size: this.size
        }).then(function(response) {
          if (response.data.pros && response.data.pros.length > 0) {
            this.pros = this.pros.concat(response.data.pros);
            this.page_num++;
            console.log(response.data.max_page);
            if (this.page_num > response.data.max_page) {
              this.end_of_rolling = 1;
              this.rolling_tips = "no more";
            }
            ({
              "else": this.rolling_tips = "下拉刷新"
            });
            setTimeout(this.height_mercy, 300);
          }
        }, function(response) {
          if (response.data.error_code === "E49") {
            alert("no more");
            return this.rolling_tips = "no more";
          } else {
            return console.log(response.data);
          }
        });
      } else {
        return this.rolling_tips = "no more";
      }
    },
    height_mercy: function() {
      if (document.body.offsetHeight <= window.screen.height) {
        this.time++;
        return this.add_items();
      }
    }
  },
  created: function() {
    this.add_items();
  },
  events: {
    'get-bottom': 'add_items'
  }
});
