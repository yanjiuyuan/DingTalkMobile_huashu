// 提示语配置文件

const promptConf = {
    Logining: "登录中...", //在登录过程中提示
    Obtaining: "获取中...", //获取中提示
    PictureProcessing: "图片处理中...", //图片处理中提示
    PictureProcessingError: "图片处理发生异常，请联系管理员", //上传图片时发生异常提示
    LoginPrompt: "您尚未登录，请重试", //登录失败提示
    Submission: "提交审批成功", //发起页提交审批成功提示
    SuccessfulSubmission: "审批成功", //审批页的成功提示
    Approver: "审批人不允许为空，请选择！", //没选审批人提示
    SearchNoReturn: "未搜索到相关结果", //搜索返回，数据为空提示
    SearchNoInput: "请输入关键字", //搜索无输入提示
    SearchNoSerialNumber: "请输入流水号", //搜索无流水号提示
    SearchNoPurchaseNumber: "请输入采购单编号", //搜索无采购单编号提示
    Download: "下载成功，请在钉钉工作通知中查收", //下载成功提示
    PrintFrom: "打印成功，请在钉钉工作通知中查收", //打印表单成功提示
    OutPutBom: "导出bom表成功，请在钉钉工作通知中查收", //导出bom表成功提示
    Withdraw: "是否撤回申请？", //撤回提示
    ApplicationWithdrawn: "申请已撤回", //申请已撤回提示
    Return: "是否退回申请？", //退回提示。
    ApplicationReturned: "申请已退回", //申请已退回提示
    Relaunch: "是否重新发起流程？", //重新发起提示
    DeletePicture: "是否删除图片？", //删除图片提示
    DeletedPicture: "图片已删除", //已删除选中的图片提示
    DuplicateFormItem: "不可重复，请重新输入！", //表单项重复提示，单项:xx不可重复,多项:xx、xx不可重复
    NotNull: "不允许为空，请输入！", //单一必填项未填写提示，xx不允许为空，请输入！
    AgreementOfPrivateCar: "请先同意《私车公用协议书》", //私车公用协议书未打钩提示
    VehicleSafety: "请先同意《研究院车辆安全使用协议》", //车辆安全使用协议为打钩提示
    GoOut: "请确认是否已提交外出申请", //申请公、私车未点击已提交外出申请提示
    NoOfficeItemsSelected: "未选择办公用品", //涉及bom表，未选择改填物品直接提交申请提示，如：办公用品申请，提示未选择办公用品
    IncompleteInformation: "请填写已选用物品信息！", //选择的物品信息不完整提示
    TemporaryPreservation: "临时保存成功，下次打开这个页面时生效", //临时保存成功时提示
    Ding: "已为您催办~", //钉一下成功提示
    CloseApplication: "请关掉应用重新打开试试~", //登录失败提示
    ModifiyComment: "修改意见成功", //领导修改审批人的意见提示
    TimeComparison: "结束时间必须大于开始时间，请重选", //结束时间小于开始时间时提示
    ItemNumberStandard: "请规范填写项目编号", //未规范填写项目编号提示
    NOSameMaterialCoding: "禁止选择相同的物料编码！", //选择相同的物料编码时提示
    GreaterThanAvailable: "大于可用数量", //大于可用数量
    Repeat: "重复提交", //重复提交时提示
    NoPicture: "照片不允许为空，请上传！", // 未上传照片提示
    NoAuthority: "您无权访问该系统，请联系管理员！", //涉及访问权限接口时无权限返回提示
    NoChooseYourself: "主管审核无法选择自己，请重选", //发起审批时主管选择自己时提示
    NoNodeInformation: "该用户无配置节点信息", //流程管理配置查询无结果时提示
    UpdateSuccess: "修改成功",
    SaveSuccess: "保存成功",
    AddSuccess: "添加成功",
    DeleteSuccess: "删除成功",
    Confirm: "确认",
    Cancel: "取消"
};

// module.exports = {
// 	promptConf:promptConf
// }

export default {
    promptConf: promptConf
};
