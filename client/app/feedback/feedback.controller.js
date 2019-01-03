(function(){
    // 'feedback strick'

    angular.module('app.feedback')
           .controller('FeedbackCtrl', ['$scope','$http','$mdDialog','$location','$timeout',FeedbackCtrl])
           .controller('ChangeFeedbackCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',ChangeFeedbackCtrl])
           .filter('textLengthSet', function() {
                return function(value, wordwise, max, tail) {
                    if (!value) return '';

                    max = parseInt(max, 10);

                    if (!max) return value;

                    if (value.length <= max) return value;

                    value = value.substr(0, max);

                    if (wordwise) {
                        var lastspace = value.lastIndexOf('');

                        if (lastspace != -1) {
                            value = value.substr(0, lastspace);
                        }
                    }

                    return value + (tail || '...');//‘...‘可以换成其它文字
                }
            })


        //反馈列表
        function FeedbackCtrl($scope,$http,$location,$mdDialog,$timeout){
            $scope.login = function(){
                if(sessionStorage.adminId == undefined){
                    $location.path('/page/signin')
                }
            }

            $timeout($scope.login(),10)

            var init;

            $scope.stores = [];
            $scope.kwtask = '';
            $scope.kwtaskId = '';
            $scope.filteredStores = [];
            $scope.row = '';
            $scope.select = select;
            $scope.onFilterChange = onFilterChange;
            $scope.onNumPerPageChange = onNumPerPageChange;
            $scope.search = search;
            $scope.numPerPageOpt = [3, 5, 10, 20];
            $scope.numPerPage = $scope.numPerPageOpt[2];
            $scope.currentPage = 1;
            $scope.currentPage = [];
            $scope.taskLists = [];

            $scope.isShow = 0;
            var authoritySet = sessionStorage.authoritySet.split(',');
            for (var i = 0; i < authoritySet.length; i++) {
                if (authoritySet[i] == "38") {
                    $scope.isShow = 1;
                }
            }

             $scope.showAlert = function(txt) {

                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(false)
                        .title(txt)
                        .ok('确定')
                    )

                }

            //获取地区列表
             $http.post('http://localhost:8080/applicationMarket-server/' + 'address/getProvinces.do',{},{params:{
                }}).success(function (data) {
                    if (data.code == 0) {
                        $scope.provinces=data.result;
                        // console.log($scope.provinces);
                    }else{
                        $scope.showAlert("获取地区列表失败");
                        window.location.reload();
                    }
                });





            function getFeedbackList(pageNum, pageSize){
                console.log($scope.feedBackDate);
                $http.post('http://localhost:8080/applicationMarket-server/' + 'feedBack/getFeedBackList.do',{},{params:{
                    pageNum:pageNum,
                    pageSize:pageSize,
                    account:$scope.userName,
                    realName:$scope.realName,
                    mobile:$scope.mobile,
                    provinceCode:$scope.provinceCode,
                    feedBackDate:$scope.feedBackDate

                }}).success(function (data) {
                    if (data.code == 0) {
                        //console.log("data.result");
                        //console.log(data.result[1].duration);
                        $scope.taskLists=data.result;
                        $scope.stores=data.result;
                        $scope.vip=data.result;
                        $scope.currentPageStores = data.result;
                        $scope.filteredStores = data.result;
                        $scope.currentPageStores.$apply;
                        $scope.total = data.total;
                        // console.log($scope.stores);
                    }else {
                        $scope.currentPageStores = null;
                    }
                });
            }


            $scope.deleteFeedBack = function(id){
                console.log(id);
                $http.post("http://localhost:8080/applicationMarket-server/" + "feedBack/deleteFeedBack.do?", {}, {
                        params: {
                            feedBackId: id
                        }
                    }).success(function (data) {
                        if (data.code == 0) {
                            // $scope.showAlert("删除管理员成功");
                            alert("删除成功");
                            $(".delete-"+id).empty();   //删除这一行数据
                        } else {
                            // $scope.showAlert(data.message);
                            alert(data.message);
                        }

                    });
            }



            $scope.export = function(){
                var obj = {title:"", titleForKey:"", data:""};
                obj.title = ["邀请人ID","邀请人类型","昵称","手机号","密码",];
                obj.titleForKey = ["taskId","taskType","nickName","mobile","password",];
                obj.data = $scope.stores;
                exportCsv(obj);
            }

            function exportCsv(obj){
                //title ["","",""]
                var title = obj.title;
                //titleForKey ["","",""]
                var titleForKey = obj.titleForKey;
                var data = obj.data;
                var str = [];
                str.push(obj.title.join(",")+"\n");
                for(var i=0;i<data.length;i++){
                    var temp = [];
                    for(var j=0;j<titleForKey.length;j++){
                        temp.push(data[i][titleForKey[j]]);
                    }

                    str.push(temp.join(",")+"\n");
                }

                var uri = 'data:text/txt;charset=utf-8,' + encodeURIComponent(str.join(""));
                var downloadLink = document.createElement("a");
                downloadLink.href = uri;
                downloadLink.download = "邀请人列表.csv";
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }

            function select(page) {
                getFeedbackList(page, $scope.numPerPage);
            };

            function onFilterChange() {
                $scope.select(1);
                $scope.currentPage = 1;
                return $scope.row = '';
            };

            function onNumPerPageChange() {
                $scope.select(1);
                return $scope.currentPage = 1;
            };


            function search() {
                $scope.feedBackDate=$("#feedBackDate").val();
                $scope.filteredStores = $scope.stores;
                console.log($scope.stores);
                return $scope.onFilterChange();
            };

           

            
            $scope.search();

           

            $scope.selected = {};

            $scope.isSelectedAll = false;

            $scope.isSelected = function (id) {
                console.log("isSelected==" + $scope.selected[id]);
                if($scope.selected[id] == true){
                    return true;
                }else{
                    return false;
                }         
            };

            var judgeSelectedAll = function () {
            var isSelectedAll = true;


          for (var i = 0; i < $scope.currentPageStores.length; i++) {


                          var vip = $scope.currentPageStores[i];

            isSelectedAll &= $scope.selected[vip.taskId];

                    }

        return isSelectedAll;
              };

              var updateSelected = function (id) {

        console.log($scope.isSelected(id));

                    if ($scope.isSelected(id)){


            $scope.selected[id] = false;


        }else{

            $scope.selected[id] = true;

        }

        $scope.isSelectedAll = judgeSelectedAll();



                   
              };



              var updateSelectedByStatus = function (id, status) {

        console.log($scope.isSelected(id));


        $scope.selected[id] = status;



                   
              };
             $scope.selectAll = function () {


        console.log("isSelectedAll1"  + $scope.isSelectedAll);


        if($scope.isSelectedAll){

            $scope.isSelectedAll = false;

        }else{

            $scope.isSelectedAll = true;


        }

                
                    for (var i = 0; i < $scope.currentPageStores.length; i++) {


                          var vip = $scope.currentPageStores[i];



            updateSelectedByStatus(vip.taskId, $scope.isSelectedAll);

                    }



              };


              $scope.selectItem = function (id) {
        console.log("selectItem"  + id);


        updateSelected(id);

              };

        //批量删除
        $scope.deleteList = function(){


                      // 确定
            var confirm = $mdDialog.confirm()
                        .title('是否确定批量删除')
                        // .ariaLabel('Lucky day')
                        // .targetEvent(ev)
                        .ok('确定删除')
                        .cancel('取消删除');

            $mdDialog.show(confirm).then(function() {
                // console.log('确定')


            var modifyTopicUrl ="http://localhost:8080/applicationMarket-server/"+"batch/deleteFeedBackBatch.do";// 接收上传文件的后台地址
                console.log($scope.selected);
                var temp = "";

                var form = new FormData();

                for(var i in $scope.selected){//用javascript的for/in循环遍历对象的属性
                    temp = i;
                    console.log(temp);
                    form.append("id", temp);
                    form.getTaskDetail
                }

                var xhr = new XMLHttpRequest();
                var response;
                xhr.open("post", modifyTopicUrl, true);
                xhr.send(form);
                xhr.onreadystatechange = doResult;
                function doResult() {
                    if(xhr.readyState == 4  && xhr.status == 200){
                        $scope.showAlert("删除成功");
                         for(var i in $scope.selected){
                            temp = i;
                            $(".delete-"+temp).css("display","none");
                                 $scope.total--;
                         }

                    } else if(xhr.readyState == 4 && xhr.status != 200){
                     // $scope.showAlert(xhr.message);
                     $scope.showAlert("删除失败");
                }


                }
                // init();
                $scope.showAlert = function(txt) {

                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(false)
                        .title(txt)
                        .ok('确定')
                    )

                }

        })

    }




           // 搜索

           $scope.searchtask = function(pageNum,pageSize){
               $scope.isSearch = true;

               $scope.taskId = $("#taskId").val();
               $scope.nickName = $("#nickName").val();
               /*$scope.csName = $("#csName").val();*/
               console.log($scope.nickName)


               /* $scope.name = $("#name").val();*/
               $scope.mobile = $("#mobile").val();



               $http.post('http://localhost:8080/applicationMarket-server/' + 'vip/gettaskList.do',{},{params:{
                taskId:$scope.kwtaskId,
                nickName:$scope.kwNickName,
                        vip:$scope.kwtask,
                        taskId:$scope.kwtaskId,
                        mobile:$scope.mobile,
                        pageNum:pageNum,
                        pageSize:pageSize
                    }}).success(function (data){
                        if(data.code == 0){
                            $scope.stores=data.result;
                            $scope.total = data.total;
                            $scope.currentPageStores = $scope.stores;
                            $scope.total.$apply;
                            $scope.currentPageStores.$apply;
                            console.log("total:" + data.total);
                        }
                    })
                    $scope.showAlert = function(txt) {
                        $mdDialog.show(
                            $mdDialog.alert()
                            .clickOutsideToClose(false)
                            .title(txt)
                            .ok('确定')
                            )

                    }
                // console.log($scope.productType);
                console.log($scope.numPerPage);

            }


        


            // init();



        }

//**************************************************
//**********修改用户反馈****************

function ChangeFeedbackCtrl($scope,$http,$location,$mdDialog,$timeout){
    
    $scope.backClick = function () {
            $location.path("/feedback/feedback-list");
        }

    $scope.login = function(){
        if(sessionStorage.adminId == undefined){
            $location.path('')
        }
    }

    $scope.isShow = 0;
            var authoritySet = sessionStorage.authoritySet.split(',');
            for (var i = 0; i < authoritySet.length; i++) {
                if (authoritySet[i] == "39") {
                    $scope.isShow = 1;
                }
            }

    //获取反馈的Id
    $scope.feedBackId = $location.search().id;
    
    $scope.showAlert = function(txt) {
                        $mdDialog.show(
                            $mdDialog.alert()
                            .clickOutsideToClose(false)
                            .title(txt)
                            .ok('确定')
                            )

                    }

    $scope.reply=function(){
        $http.post('http://localhost:8080/applicationMarket-server/' + 'feedBack/replyFeedBack.do',{},{params:{
                    adminId:sessionStorage.adminId,
                    content:$scope.content,
                    feedBackId:$scope.feedBackId
                    }}).success(function (data){
                        if(data.code == 0){
                            $scope.showAlert("回复成功");
                        }else{
                            $scope.showAlert(data.message);
                        }
                    })
    }

    $scope.feedback = {};

    $scope.doUploadPhoto=function(element){

        $scope.fileObj = element.files[0];
    }

    $scope.modifyFeedback = function(){
        $scope.showConfirm = function() {
                            // 确定
                            var confirm = $mdDialog.confirm()
                            .title('是否确定修改用户反馈')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定修改')
                            .cancel('取消修改');
                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    var changeFeedbackUrl ="http://localhost:8080/applicationMarket-server/" + "feedback/modifyFeedback.do?";
                    // FormData 对象
                    var form = new FormData();
                    form.append("feedbackId",$scope.feedback.feedbackId);
                    form.append("adminId",sessionStorage.adminId);
                    form.append("adminDescription",$scope.feedback.adminDescription);

                    var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", changeFeedbackUrl, true);

                    xhr.send(form);

                    xhr.onreadystatechange = doResult;

                    function doResult() {

                        if (xhr.readyState == 4) {//4代表执行完成


                            if (xhr.status == 200) {//200代表执行成功
                           //将xmlHttpReg.responseText的值赋给ID为resText的元素
                           $scope.showAlert("修改用户反馈成功");

                       }
                   }

               }

           }, function() {
                    // //console.log('取消')
                    $scope.showAlert("取消上传");
                });
                        };
                        $scope.showAlert = function(txt) {
                 // dialog
                 $mdDialog.show(
                    $mdDialog.alert()

                    .clickOutsideToClose(false)
                    .title(txt)
                    .ok('确定')
                    ).then(function() {
                       $location.path('/feedback/feedback-list');
                   })
                }
                $scope.showConfirm();
            }
            $scope.backClick = function(){
                $location.path("/feedback/feedback-list");
            }

        }

    })();