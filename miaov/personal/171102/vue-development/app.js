//存取localStorage中的数据

var store = {
	save(key, value){
		return localStorage.setItem(key, JSON.stringify(value))
	},
	fetch(key){
		return JSON.parse(localStorage.getItem(key)) || []
	}
}
// var list = [
// 	{
// 		title:"吃饭打豆豆",
// 		isChecked:false //状态为false，为不选中  任务未完成
// 	},
// 	{
// 		title:"miaov",
// 		isChecked:true   //状态为true，为选中    任务完成
// 	}
// ];

//取出所有的值
var list = store.fetch('zhiHui')

//过滤的时候有三种情况 all finished unfinished

var filter = {
	all:function(list){
		return list
	},
	finished:function(list){
		return list.filter(function(item){
			return item.isChecked
		})
	},
    unfinished:function(list){
        return list.filter(function(item){
            return !item.isChecked
        })
    }
}

var vm = new Vue({
	el:".main",
	data:{
		list:list,
        unfinishedList: [],
        CompletedList: [],
		todo:"",
		edtorTodos:'',  //记录正在编辑的数据
		beforeTitle:'', //记录正在编辑的数据的title
		visibility: 'all'//通过这个属性值的变化对数据进行筛选
	},
	watch: {
		/*list: function(){//监控list这个属性，当这个属性对应的值发生变化就会执行函数

		}*///浅监控，对象里面的某个某个值（isChecked: true or false）发生改变，监控不到
		list: {
			handler:function(){
                store.save("zhiHui", this.list)
			},
			deep: true //深监控
		}
	},
	computed:{
		noCheckeLength:function(){
			return this.list.filter(function(item){
                return !item.isChecked
            }).length
		},
		filteredList:function(){
			//找到了过滤函数,就返回过滤后的数据；如果没有返回所有数据
            console.log(filter[this.visibility])
            return filter[this.visibility] ? filter[this.visibility](list) :  list
		}
	},
	methods:{
		addTodo(){  //添加任务
			this.list.push({
				title:this.todo,
				isChecked:false
			});
			this.todo = '';
		},
		deleteTodo(todo){ //删除任务
			var index = this.list.indexOf(todo);
			console.log(index)
			this.list.splice(index,1);
		},
		edtorTodo(todo){  //编辑任务
			console.log(todo);
			//编辑任务的时候，记录一下编辑这条任务的title，方便在取消编辑的时候重新给之前的title
			this.beforeTitle = todo.title;

			this.edtorTodos = todo;


		},
		edtorTodoed(todo){ //编辑任务成功
			this.edtorTodos = '';
		},
		cancelTodo(todo){  //取消编辑任务

			todo.title = this.beforeTitle;

			this.beforeTitle = '';

			//让div显示出来，input隐藏
			this.edtorTodos = '';
		},
		changeStatus (status) {
			this.status = status
		}
	},
	directives:{
		"foucs":{
			update(el,binding){
				// console.log(el)
				// console.log(binding)
				if(binding.value){
					el.focus();
				}
			}
		}
	}
});

function watchHashChange() {
	// console.log(123)
	var hash = window.location.hash.slice(1);
	// console.log( window.location)
	// console.log(hash)

	vm.visibility = hash;
}

watchHashChange();//防止页面刷新，数据不对

window.addEventListener('hashchange', watchHashChange);