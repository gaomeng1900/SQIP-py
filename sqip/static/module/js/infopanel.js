var infopanel_tpl, style;

console.log('infopanel');

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

infopanel_tpl = '<div class="info_panel">\n	<div class="poster" :style="{\'background-image\': \'url(\' + pro.img + \')\'}"></div>\n	<section>\n		<div class="title">{{pro.pro_name}}</div>\n		<ul class="info">\n			<li>\n				<div class="define">\n					<i class="iconfont">&#58918;</i> 项目类型: \n				</div>\n				<div class="descrip">\n					{{pro.type}}\n				</div>\n			</li>\n			<li style="vertical-align:top;">\n				<div class="define">\n					<i class="iconfont">&#58917;</i> 指导老师: \n				</div>\n				<div class="descrip">\n					{{pro.tutor}}\n				</div>\n			</li>\n			<li style="vertical-align:top;">\n				<div class="define">\n					<i class="iconfont">&#58921;</i> 负责人: \n				</div>\n				<div class="descrip">\n					{{pro.in_charge}}\n				</div>\n			</li>\n			<li style="vertical-align:top;">\n				<div class="define">\n					<i class="iconfont">&#xe619;</i> 团队: \n				</div>\n				<div class="descrip">\n					{{pro.staff}}\n				</div>\n			</li>\n			<li style="vertical-align:top;">\n				<div class="define">\n					<i class="iconfont">&#58912;</i> 活动时间: \n				</div>\n				<div class="descrip">\n					{{pro.time}}\n				</div>\n			</li>\n			<li style="vertical-align:top;">\n				<div class="define">\n					<i class="iconfont">&#58886;</i> 活动地点: \n				</div>\n				<div class="descrip">\n					{{pro.place}}\n				</div>\n			</li>\n			<li style="vertical-align:top;">\n				<div class="define">\n					<i class="iconfont">&#58903;</i> 状态: \n				</div>\n				<div class="descrip">\n					{{pro.state}}\n				</div>\n			</li>\n		</ul>\n	</section>\n	<section>\n		<div class="section_title">活动简介</div>\n		<p>{{pro.intro}}</p>\n	</section>\n	<section>\n		<div class="section_title">参与方式</div>\n		<p>{{pro.join_us}}</p>\n	</section>\n</div>';

style = document.createElement('style');

style.innerHTML = '/* 必需 */\n.expand-transition {\n  transition: all .3s ease;\n  transform:scale(1,1);\n  opacity: 1;\n}\n\n/* .expand-enter 定义进入的开始状态 */\n/* .expand-leave 定义离开的结束状态 */\n.expand-enter, .expand-leave {\n  opacity: 0;\n  transform:scale(.7,.7);\n}';

document.getElementsByTagName('HEAD').item(0).appendChild(style);

Vue.component('infopanel', {
  template: infopanel_tpl,
  data: function() {
    return {
      project_id: '',
      pro: {}
    };
  },
  methods: {
    render: function() {
      var params;
      if (the_pro) {
        console.log("got pro");
        this.pro = the_pro;
        return this.project_id = the_pro.id;
      } else if (project_id) {
        console.log("got id, rendering");
        this.project_id = project_id;
        return this.$http.get('http://127.0.0.1:9032/api/v1/projects/' + this.project_id, params = {
          page: this.page_num,
          size: this.size
        }).then(function(response) {
          if (response.data.status === 'success') {
            this.pro = response.data.pro;
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
        return alert("need project_id");
      }
    }
  },
  created: function() {
    this.render();
  }
});
