import pub from '/util/public';
import promptConf from "/util/promptConf.js";
let app = getApp();
let good = {}
Page({
	...pub.func,
	...pub.func.start,
	data: {
		...pub.data,
		hidden: true,
		checked: false,
		checked2: false,
		table: {},
		items: [{ name: '本人同意《私车公用协议书》' }],
		items2: [{ name: '本人已经提交外出申请' }]
	},
	submit(e) {
		let that = this;
		let value = e.detail.value;
		console.log(value);
		if (this.data.nodeList[1].AddPeople[0] == undefined) {
			dd.alert({
				content: promptConf.promptConf.Approver,
				buttonText: promptConf.promptConf.Confirm
			})
			return;
		}
		if (this.data.checked == false) {
			dd.alert({
				content: promptConf.promptConf.AgreementOfPrivateCar,
				buttonText: promptConf.promptConf.Confirm
			})
			return;
		}
		if (this.data.checked2 == false) {
			dd.alert({
				content: promptConf.promptConf.GoOut,
				buttonText: promptConf.promptConf.Confirm
			})
			return;
		}
		if (this.data.nodeList[1].AddPeople[0].userId == "0907095238746571") {
			dd.alert({
				content: '用车无需季老师审批,如是部长级请选本人',
				buttonText: promptConf.promptConf.Confirm
			})
			return
		}
		if (value.title.trim() == "") {
			dd.alert({
				content: `标题不能为空，请输入!`,
				buttonText: promptConf.promptConf.Confirm
			})
		}
		value['CarId'] = ''
		value['IsChooseOccupyCar'] = true
		value['IsPublicCar'] = false
		value['OccupyCarId'] = ''
		value["PeerNumber"] = this.data.table.PeerNumber;
		console.log(value);
		if (!value.DrivingMan || !value.MainContent || !value.PlantTravelWay || !value.StartTime || !value.EndTime || !value.CarNumber) {
			dd.alert({
				content: '表单未填写完整',
				buttonText: promptConf.promptConf.Confirm
			})
			return
		}
		if (!this.data.checked || !this.data.checked2) {
			console.log(this.data.checked)
			console.log(this.data.checked2)
			dd.alert({ content: '未全勾选‘同意’选项' })
			return
		}
		let callBack = function(taskId) {
			console.log("提交审批ok!")
			value['TaskId'] = taskId
			that._postData("CarTableNew/TableSave",
				(res) => {
					that.doneSubmit()
				}, value
			)
		}

		this.approvalSubmit({ Title: value.title, remark: value.remark }, callBack)
	},

	choosePeoples(e) {
		console.log('start choose people');
		let nodeId = e.target.targetDataset.NodeId;
		let that = this;
		dd.complexChoose({
			...that.data.chooseParam,
			pickedUsers: that.data.pickedUsers || [],            //已选用户
			multiple: true,
			title: "同行人",
			success: function(res) {
				console.log(res);
				let names = [];//userId
				if (res.departments.length == 0 && res.users.length > 0) {
					that.data.pickedUsers = [];
					for (let d of res.users) {
						that.data.pickedUsers.push(d.userId);
						names.push(d.name);
					}
					that.setData({
						'table.PeerNumber': names.join(',')
					})
				}
				else if (res.departments.length > 0 && res.users.length == 0) {
					let deptId = [];
					for (let i of res.departments) {
						deptId.push(i.id);
					}

					that.postDataReturnData("DingTalkServers/GetDeptAndChildUserListByDeptId", (result) => {
						console.log(result.data);
						that.data.pickedUsers = [];
						that.data.pickedDepartments = [];
						let userlist = [];
						for (let i in result.data) {
							let data = JSON.parse(result.data[i]);
							that.data.pickedDepartments.push(i);
							userlist.push(...data.userlist);
							for (let d of data.userlist) {
								that.data.pickedUsers.push(d.userid);
								names.push(d.name);
								d.userId = d.userid;
							}
						}
						that.data.pickedUsers = [...new Set(that.data.pickedUsers)];
						names = [...new Set(names)];//数组去重
						that.setData({
							'table.PeerNumber': names.join(',')
						})
					}, deptId)
				}
				else if (res.departments.length > 0 && res.users.length > 0) {
					let deptId = [];
					for (let i of res.departments) {
						deptId.push(i.id);
					}

					that.postDataReturnData("DingTalkServers/GetDeptAndChildUserListByDeptId", (result) => {
						console.log(result.data);
						that.data.pickedUsers = [];
						that.data.pickedDepartments = [];
						let userlist = [];
						for (let i in result.data) {
							let data = JSON.parse(result.data[i]);
							that.data.pickedDepartments.push(i);
							userlist.push(...data.userlist);
							for (let d of data.userlist) {
								that.data.pickedUsers.push(d.userid);
								names.push(d.name);
								d.userId = d.userid;
							}
						}
						//组织外的人
						for (let i of res.users) {
							that.data.pickedUsers.push(i.userId);
							names.push(i.name);
						}
						that.data.pickedUsers = [...new Set(that.data.pickedUsers)];
						names = [...new Set(names)];//数组去重
						that.setData({
							'table.PeerNumber': names.join(',')
						})
					}, deptId)
				}
			},
			fail: function(err) {

			}
		})
	},
	//同意协议选项
	onChecked(e) {
		this.setData({
			checked: !this.data.checked,
			disablePage: this.data.checked
		})
	},
	onChecked2(e) {
		this.setData({
			checked2: !this.data.checked2,
			disablePage: this.data.checked2
		})
	},
	downLoad() {
		let param = {
			UserId: this.data.DingData.userid,
			// 阿法迪 Media_Id: '@lArPDeC2tzsRLpzOWVoCUs4-J34O'
			Media_Id: '@lArPDeC2t0PoLXvOAzqTa84ublTK'
		}
		this._postData("DingTalkServers/sendFileMessageNew",
			(res) => {
				dd.alert({
					content: promptConf.promptConf.Download,
					buttonText: promptConf.promptConf.Confirm

				})
			}, param
		)
	},
	//选择时间
	selectStartDateTime() {
		dd.datePicker({
			format: 'yyyy-MM-dd HH:mm',
			currentDate: this.data.DateStr + ' ' + this.data.TimeStr,
			startDate: this.data.DateStr + ' ' + this.data.TimeStr,
			endDate: this.data.Year + 1 + '-' + this.data.Month + '-' + this.data.Day + ' ' + this.data.TimeStr,
			success: (res) => {
				if (this.data.endDateStr) {
					//判断时间
					let start = new Date(res.date.replace(/-/g, '/')).getTime();
					let end = new Date(this.data.endDateStr.replace(/-/g, '/')).getTime();
					if (end < start) {
						dd.alert({
							content: promptConf.promptConf.TimeComparison,
							buttonText: promptConf.promptConf.Confirm
						})
						return;
					}
				}
				this.setData({
					startDateStr: res.date,
					'table.StartTime': res.date
				})
			},
		});
	},
	selectEndDateTime() {
		dd.datePicker({
			format: 'yyyy-MM-dd HH:mm',
			currentDate: this.data.DateStr + ' ' + this.data.TimeStr,
			startDate: this.data.DateStr + ' ' + this.data.TimeStr,
			endDate: this.data.Year + 1 + '-' + this.data.Month + '-' + this.data.Day + ' ' + this.data.TimeStr,
			success: (res) => {

				if (this.data.startDateStr) {
					//判断时间
					let start = new Date(this.data.startDateStr.replace(/-/g, '/')).getTime();
					let end = new Date(res.date.replace(/-/g, '/')).getTime();
					if (end < start) {
						dd.alert({
							content: promptConf.promptConf.TimeComparison,
							buttonText: promptConf.promptConf.Confirm
						})
						return;
					}
				}
				this.setData({
					endDateStr: res.date,
					'table.EndTime': res.date
				})
			},
		});
	},

	onReady() {
		this.setData({
			checked: false,
			checked2: false,
		})
	}
});
