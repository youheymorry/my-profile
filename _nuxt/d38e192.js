(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{788:function(t,e,r){"use strict";r.r(e);var o=r(351),l=r(257),n=r(122),c=r(539),d=r(253),_=r(533),m=r(80),v={name:"ErrorDialog",data:function(){return{dialog:!1,err:{code:404,name:"Default",message:"Default"}}},methods:{showDialog:function(t){this.err=t,this.dialog=!0}}},f=r(81),component=Object(f.a)(v,(function(){var t=this,e=t._self._c;return e(c.a,{attrs:{persistent:"","max-width":"400"},model:{value:t.dialog,callback:function(e){t.dialog=e},expression:"dialog"}},[e(l.a,[e(m.a,{attrs:{color:"error",dark:""}},[e(d.a,{staticClass:"mx-1",attrs:{large:""}},[t._v("mdi-alert-circle")]),t._v(" "),e("span",{staticClass:"text-h6 my-auto mx-1"},[t._v("Error (Code:")]),t._v(" "),e("span",{staticClass:"text-h6 my-auto"},[t._v(t._s(null==t.err.code?0:t.err.code)+")")])],1),t._v(" "),e(n.b,{staticClass:"mt-3"},[e("span",{staticClass:"text-subtitle-1 font-weight-bold"},[t._v(t._s(t.err.message))])]),t._v(" "),e(n.a,[e(_.a),t._v(" "),e(o.a,{attrs:{color:"blue"},on:{click:function(e){t.dialog=!1}}},[t._v("OK")])],1)],1)],1)}),[],!1,null,null,null);e.default=component.exports}}]);