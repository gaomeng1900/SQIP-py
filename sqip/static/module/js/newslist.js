var newslist_tpl, style;

console.log('newslist');

Vue.config.debug = true;

Vue.filter('removeHTML', function(str) {
  str = str.replace(/<\/?[^>]*>/g, '');
  str = str.replace(/[ | ]*\n/g, '\n');
  str = str.replace(/\n[\s| | ]*\r/g, '\n');
  str = str.replace(/&nbsp;/ig, '');
  return str;
});

Vue.filter('lenLimit', function(str, l) {
  return str.toString().slice(0, l);
});

newslist_tpl = '<div class="list_panel">\n	<div class="list_panel_header">\n		当前活动 &gt; {{project_name}}\n	</div>\n	<ul>\n		<a href="//www.yiban.cn/blog/index/otherblog/suid/{{news.User_id}}/blogid/{{news.id}}" v-for="news of news_list" track-by="$index" transition="expand">\n			<li>\n				<div class="thumbnail" :style="{\'background-image\': \'url(\' + (news.fimage || default_img) + \')\'}"></div>\n				<div class="text">\n					<h3>{{news.title}}</h3>\n					<p class="abstra">{{news.content | removeHTML | lenLimit 90}}</p>\n					<div class="info"><span class="time"><i class="iconfont">&#58889;</i>{{news.updateTime | lenLimit 10}}</span></div>\n				</div>\n				<div class="clear"></div>\n			</li>\n		</a>\n	</ul>\n	<div class="clear"></div>\n	<div id="rolling_tips">{{rolling_tips}}</div>\n</div>';

style = document.createElement('style');

style.innerHTML = '/* 必需 */\n.expand-transition {\n  transition: all .3s ease;\n  transform:scale(1,1);\n  opacity: 1;\n}\n\n/* .expand-enter 定义进入的开始状态 */\n/* .expand-leave 定义离开的结束状态 */\n.expand-enter, .expand-leave {\n  opacity: 0;\n  transform:scale(.7,.7);\n}';

document.getElementsByTagName('HEAD').item(0).appendChild(style);

Vue.component('newslist', {
  template: newslist_tpl,
  data: function() {
    return {
      news_list: [],
      page_num: 1,
      max_page: 2,
      end_of_rolling: 0,
      rolling_tips: "....",
      time: 0,
      project_name: "",
      project_id: "",
      size: 6,
      default_img: 'http://www.yiban.cn/upload/system/201603/160304155044413800.jpg'
    };
  },
  methods: {
    add_items: function() {
      var params;
      console.log("add_items ing ...");
      if (!this.end_of_rolling) {
        this.rolling_tips = "载入中....";
        return this.$http.get('/api/v1/projects/' + this.project_id + '/news', params = {
          page: this.page_num,
          size: this.size
        }).then(function(response) {
          if (response.data.news_list && response.data.news_list.length > 0) {
            this.news_list = this.news_list.concat(response.data.news_list);
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
    },
    data_init: function() {
      if (the_pro) {
        this.project_name = the_pro.pro_name;
        return this.project_id = the_pro.id;
      } else {
        return alert("newslist: need pro");
      }
    }
  },
  created: function() {
    this.data_init();
    this.add_items();
  },
  events: {
    'get-bottom': 'add_items'
  }
});
