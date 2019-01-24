(function() {
    // 'use strict';
    angular.module('app.currency')
    .controller('CurrencyCtrl', ['$scope', '$filter', '$http', '$mdDialog', CurrencyCtrl])
    .controller('CurrencyDetailCtrl', ['$scope', '$http', '$location', '$mdDialog', CurrencyDetailCtrl])
    .controller('AddCurrencyCtrl', ['$scope', '$http', '$mdDialog', AddCurrencyCtrl]) //,'$upload'
    // .controller('ImageCtrl', ['$scope', '$http', '$mdDialog', '$location', '$timeout', ImageCtrl])
    // .controller('AddImageCtrl', ['$scope', '$http', '$mdDialog', AddImageCtrl]) //,'$upload'
    .controller('ChangeCurrencyCtrl', ['$scope', '$http','$location','$mdDialog','$timeout',ChangeCurrencyCtrl])
    function CurrencyCtrl($scope, $filter, $http, $mdDialog) {
        var idTmr;

        function getExplorer() {
            var explorer = window.navigator.userAgent;
            //ie 
            if (explorer.indexOf("MSIE") >= 0) {
                return 'ie';
            }
            //firefox 
            else if (explorer.indexOf("Firefox") >= 0) {
                return 'Firefox';
            }
            //Chrome
            else if (explorer.indexOf("Chrome") >= 0) {
                return 'Chrome';
            }
            //Opera
            else if (explorer.indexOf("Opera") >= 0) {
                return 'Opera';
            }
            //Safari
            else if (explorer.indexOf("Safari") >= 0) {
                return 'Safari';
            }
        }
        var init;
        $scope.stores = [];
        $scope.searchKeywords = '';
        $scope.filteredStores = [];
        $scope.row = '';
        $scope.select = select;
        $scope.onFilterChange = onFilterChange;
        $scope.onNumPerPageChange = onNumPerPageChange;
        $scope.search = search;
        $scope.numPerPageOpt = [3, 5, 10, 20];
        $scope.numPerPage = $scope.numPerPageOpt[2];
        $scope.currentPage = 1;
        $scope.hstep = "理财一对一"
        $scope.options = ["理财一对一", "活动预览", "理财小常识"]
        $scope.activated1 = "是";
        $scope.activated2 = "否";



       // currencyName,currencyLocation,currencyType,activated,startDate,endDate
       $scope.currencyName="";
       $scope.currencyLocation="";
       $scope.currencyType="";
       $scope.activated="";
       $scope.startDate="";
       $scope.endDate="";
       $scope.platform="";


        $scope.getTable = function() {
            method1("newTable");
        }
        $scope.getallTable = function() {
            method1("allnewTable");
        }
        $scope.isShow = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "55") {
                $scope.isShow = 1;
            }
        }


        //获取广告列表
        function getCurrencyList(pageNum, pageSize) {
            

            $http.post('http://localhost:8080/applicationMarket-server/' + 'currency/getCurrencyList.do', {}, {
                params: {
                    pageNum: pageNum,
                    pageSize: pageSize,
                    type:$scope.type
                }
            }).success(function(data) {
                if (data.code == 0) {
                    $scope.stores = data.result;
                    $scope.currentPageStores = data.result;
                    $scope.filteredStores = data.result;
                    // $scope.currentPageStores.$apply;
                    $scope.total = data.total;
                    console.log($scope.stores);
                }else{
                    $scope.stores = null;
                }
            });
        } 

        function select(page) {
            var end, start;
            start = (page - 1) * $scope.numPerPage;
            end = start + $scope.numPerPage;
            //console.log('$scope.numPerPage=='+$scope.numPerPage);
            getCurrencyList(page, $scope.numPerPage);
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
            $scope.endDate=$("#endDate").val();
            $scope.startDate=$("#startDate").val();
            $scope.filteredStores = $scope.stores;
            ////console.log($scope.stores);
            return $scope.onFilterChange();
        };


        //置顶
        $scope.topCurrency = function(id) {
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm().title('该广告确定置顶?')
                    
                    .ok('确定').cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    // //console.log('确定')
                    $http({
                        method: 'post',
                        url: 'http://localhost:8080/applicationMarket-server/' + 'currency/topCurrency.do',
                        data: $.param({
                            currencyId: id
                            // activated: 2
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).success(function(data) {
                        // console.log(data.errorCode)
                        if (data.code==0) {
                            $scope.showAlert("置顶成功");
                            init();
                            
                        } else {
                            $scope.showAlert(data.errorMessage);
                        }
                    });
                }, function() {
                    // //console.log('取消')
                    $scope.showAlert("取消");
                });
            };

            $scope.showAlert = function(txt) {
                // dialog
                $mdDialog.show($mdDialog.alert()
                    // .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(false).title(txt)
                    // .content('You can specify some description text in here.')
                    // .ariaLabel('Alert Dialog Demo')
                    .ok('确定')
                    // .targetEvent()
                )
                // ).then(function(){
                //     // $('.userForm').reset();
                // })
            }
            $scope.showConfirm();
        }




        // 上线
        $scope.makeEffect = function(id) {
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm().title('该广告是否上线')
                    // .ariaLabel('Lucky day')
                    // .targetEvent(ev)
                    .ok('确定').cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    // //console.log('确定')
                    $http({
                        method: 'post',
                        url: 'http://localhost:8080/applicationMarket-server/' + 'currency/upCurrency.do',
                        data: $.param({
                            currencyId: id
                            // activated: 2
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).success(function(data) {
                        // console.log(data.errorCode)
                        if (data.code==0) {
                            $scope.showAlert("上线成功");
                            for(var i=0;i<$scope.stores.length;i++){
                                if ($scope.stores[i].currencyId==id) {
                                    $scope.stores[i].activated=1;
                                    return;
                                }
                            };
                            
                        } else {
                            $scope.showAlert(data.errorMessage);
                        }
                    });
                }, function() {
                    // //console.log('取消')
                    $scope.showAlert("取消");
                });
            };

            $scope.showAlert = function(txt) {
                // dialog
                $mdDialog.show($mdDialog.alert()
                    // .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(false).title(txt)
                    // .content('You can specify some description text in here.')
                    // .ariaLabel('Alert Dialog Demo')
                    .ok('确定')
                    // .targetEvent()
                )
                // ).then(function(){
                //     // $('.userForm').reset();
                // })
            }
            $scope.showConfirm();
        }
        
        // 下线
        $scope.makeUnEffect = function(id) {
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm().title('该广告是否下线')
                    // .ariaLabel('Lucky day')
                    // .targetEvent(ev)
                    .ok('确定').cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    // //console.log('确定')
                    $http({
                        method: 'post',
                        url: 'http://localhost:8080/applicationMarket-server/' + 'currency/downCurrency.do',
                        data: $.param({
                            currencyId: id
                            // activated: 1
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).success(function(data) {
                        if (data.code=0) {
                            $scope.showAlert("下线成功");
                            for(var i=0;i<$scope.stores.length;i++){
                                if ($scope.stores[i].currencyId==id) {
                                    $scope.stores[i].activated=2;
                                    return;
                                }
                            };
                            // init();
                        } else {
                            $scope.showAlert(data.errorMessage);
                        }
                    })
                }, function() {
                    // //console.log('取消')
                    $scope.showAlert("取消");
                });
            };
            
            $scope.showAlert = function(txt) {
                // dialog
                $mdDialog.show($mdDialog.alert()
                    // .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(false).title(txt)
                    // .content('You can specify some description text in here.')
                    // .ariaLabel('Alert Dialog Demo')
                    .ok('确定')
                    // .targetEvent()
                )
                // ).then(function(){
                //     // $('.userForm').reset();
                // })
            }
            $scope.showConfirm();
        }
        init = function() {
            $http.post('http://localhost:8080/applicationMarket-server/' + 'currency/getCurrencyList.do', {}, {
                params: {
                    pageNum: 1,
                    pageSize: $scope.numPerPage
                }
            }).success(function(data) {
                if (data.code == 0) {
                    console.log(data.result);
                    console.log("type:"+$scope.currencyType);
                    $scope.stores = data.result;
                    $scope.currentPageStores = data.result;
                    $scope.filteredStores = data.result;
                    // $scope.currentPageStores.$apply;
                    $scope.total = data.total;
                };
            });
        };


        // 删除公告
        $scope.deleteCurrency = function(id) {
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm().title('是否确定删除')
                    // .ariaLabel('Lucky day')
                    // .targetEvent(ev)
                    .ok('确定').cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    // //console.log('确定')
                    $http.post('http://localhost:8080/applicationMarket-server/' + 'currency/deleteCurrencyById.do', {}, {
                params: {
                    currencyId:id
                }
            }).success(function(data) {
                if (data.code == 0) {
                    $scope.showAlert("删除成功");
                    $(".delete-"+id).remove();
                }else{
                    $scope.showAlert(data.message);
                }
            });
                }, function() {
                    // //console.log('取消')
                    $scope.showAlert("取消删除");
                });
            };


            $scope.showAlert = function(txt) {
                // dialog
                $mdDialog.show($mdDialog.alert()
                    // .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(false).title(txt)
                    // .content('You can specify some description text in here.')
                    // .ariaLabel('Alert Dialog Demo')
                    .ok('确定')
                    // .targetEvent()
                )
                // ).then(function(){
                //     // $('.userForm').reset();
                // })
            }
            $scope.showConfirm();
        }
        // 搜索公告
        // $scope.searchCurrency = function(){
        //     $scope.currencyName = $(".currencyName").val();
        //     $scope.currencyType = $(".currencyType option:selected").text();
        //     // //console.log($scope.currencyName);
        //     // //console.log($scope.currencyType);
        //     switch($scope.currencyType){
        //         case '主页currency': $scope.currencyType = 1;break;
        //         case '成功案例currency'  : $scope.currencyType = 2;break;
        //         case '活动介绍currency': $scope.currencyType = 3;break;
        //         case '员工风采currency': $scope.currencyType = 4;break;
        //         case '培训和发展currency'  : $scope.currencyType = 5;break;
        //         case '企业社会责任currency': $scope.currencyType = 6;break;
        //         case '行业殊荣currency': $scope.currencyType = 7;break;
        //     }
        //     //console.log($scope.currencyType);
        //     $http.post('http://139.196.7.76:8080/chinatravel-server/' + 'Currency/',{},{params:{
        //     }}).success(function (data){
        //     })
        // }
        function initall(pageNum, pageSize) {
            $http({
                method: 'POST',
                url: 'http://localhost:8080/applicationMarket-server/' + 'currency/getCurrencyList.do',
                data: $.param({
                    pageNum: 1,
                    pageSize: 200
                }), //序列化参数
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function(data) {
                if (data.errorCode == 0) {
                    $scope.allstores = data.result;
                };
            });
        }
        initall();
        init();
    }

    function CurrencyDetailCtrl($scope, $http, $location, $mdDialog) {
        $scope.login = function() {
            if (sessionStorage.adminId == undefined) {
                $location.path('/page/signin')
            }
        }
        //$timeout($scope.login(),10)
        $scope.backClick = function() {
            $location.path('/Currency/currency-list');
        }
        $scope.cancelClick = function() {
            $(".currency-detail input").attr('disabled', true);
            $(".currencyType").css("display", "block");
            $(".currencyTypeSelect").css("display", "none");
            $(".changeConfirm").css("display", "none");
            $(".cancelClick").css("display", "none");
            switch ($scope.currency.type) {
                case '主页currency':
                    $scope.currencyType = 1;
                    break;
                case '成功案例currency':
                    $scope.currencyType = 2;
                    break;
                case '活动介绍currency':
                    $scope.currencyType = 3;
                    break;
                case '员工风采currency':
                    $scope.currencyType = 4;
                    break;
                case '培训和发展currency':
                    $scope.currencyType = 5;
                    break;
                case '企业社会责任currency':
                    $scope.currencyType = 6;
                    break;
                case '行业殊荣currency':
                    $scope.currencyType = 7;
                    break;
            }
        }
        $scope.currencyId = $location.search().id;
        //console.log($location.search().id);
        //console.log($scope.currencyId);
        $http.post('https://www.citsgbt.com/chinatravel-php/app/index.php?r=Currency/GetCurrencyById', {}, {
            params: {
                currencyId: $scope.currencyId
            }
        }).success(function(data) {
            if (data.errorCode == 0) {
                $scope.currency = data.result;
                switch ($scope.currency.type) {
                    case 1:
                        $scope.currency.type = "首页currency图";
                        break;
                }
            }
        })
        // 修改
        $scope.changeClick = function() {
            //console.log("修改")
            $(".currency-detail input").attr('disabled', false);
            $(".currencyId").attr('disabled', true);
            $(".currencyType").css("display", "none");
            $(".cancelClick").css("display", "inline");
            $(".currencyTypeSelect").css("display", "block");
            $(".changeConfirm").css("display", "block");
        }
        // 确认修改
        $scope.changeConfirm = function() {
            switch ($scope.currency.type) {
                case '主页currency':
                    $scope.currencyType = 1;
                    break;
                case '成功案例currency':
                    $scope.currencyType = 2;
                    break;
                case '活动介绍currency':
                    $scope.currencyType = 3;
                    break;
                case '员工风采currency':
                    $scope.currencyType = 4;
                    break;
                case '培训和发展currency':
                    $scope.currencyType = 5;
                    break;
                case '企业社会责任currency':
                    $scope.currencyType = 6;
                    break;
                case '行业殊荣currency':
                    $scope.currencyType = 7;
                    break;
            }
            //console.log('id='+$scope.currency.currencyId);
            //console.log('type='+$scope.currency.type);
            //console.log($scope.currency.imageUrl);
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm().title('是否确定修改图片信息')
                    // .ariaLabel('Lucky day')
                    // .targetEvent(ev)
                    .ok('确定').cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    //console.log('id='+$scope.currency.currencyId);
                    //console.log('type='+$scope.currency.type);
                    //console.log($scope.currency.imageUrl);
                    // $http.post("http://139.196.7.76:8080/chinatravel-server/"+"Currency/modifyCurrency",{},{params:{
                    //     currencyId:$scope.currency.currencyId,
                    //     type:$scope.currency.type,
                    //     imageUrl:$scope.currency.imageUrl
                    // }}).success(function (data){
                    //     if(data.errorCode == 0){
                    //         $scope.showAlert("修改图片信息成功");
                    //     } else {
                    //         $scope.showAlert1(data.errorMessage);
                    //     }
                    // })
                    $.ajax({
                        type: "POST",
                        cache: false,
                        url: "http://139.196.7.76:8080/chinatravel-server/" + "Currency/ModifyCurrency",
                        data: {
                            currencyId: $scope.currency.currencyId,
                            type: $scope.currency.type,
                            imageUrl: $scope.currency.imageUrl
                        },
                        success: function(data) {
                            if (data) {
                                $scope.showAlert("修改图片信息成功");
                            } else {
                                $scope.showAlert1(data.errorMessage);
                            }
                        }
                    });
                }, function() {
                    // //console.log('取消')
                    $scope.showAlert1("取消修改图片信息");
                });
            };
            $scope.showAlert = function(txt) {
                // dialog
                $mdDialog.show($mdDialog.alert()
                    // .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(false).title(txt)
                    // .content('You can specify some description text in here.')
                    // .ariaLabel('Alert Dialog Demo')
                    .ok('确定')
                    // .targetEvent()
                ).then(function() {
                    $(".currency-detail input").attr('disabled', true);
                    $(".currencyType").css("display", "block");
                    $(".currencyTypeSelect").css("display", "none");
                    $(".changeConfirm").css("display", "none");
                    $(".cancelClick").css("display", "none");
                    switch ($scope.currency.type) {
                        case '主页currency':
                            $scope.currencyType = 1;
                            break;
                        case '成功案例currency':
                            $scope.currencyType = 2;
                            break;
                        case '活动介绍currency':
                            $scope.currencyType = 3;
                            break;
                        case '员工风采currency':
                            $scope.currencyType = 4;
                            break;
                        case '培训和发展currency':
                            $scope.currencyType = 5;
                            break;
                        case '企业社会责任currency':
                            $scope.currencyType = 6;
                            break;
                        case '行业殊荣currency':
                            $scope.currencyType = 7;
                            break;
                    }
                })
            }
            $scope.showAlert1 = function(txt) {
                // dialog
                $mdDialog.show($mdDialog.alert()
                    // .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(false).title(txt)
                    // .content('You can specify some description text in here.')
                    // .ariaLabel('Alert Dialog Demo')
                    .ok('确定')
                    // .targetEvent()
                ).then(function() {
                    switch ($scope.currency.type) {
                        case '主页currency':
                            $scope.currencyType = 1;
                            break;
                        case '成功案例currency':
                            $scope.currencyType = 2;
                            break;
                        case '活动介绍currency':
                            $scope.currencyType = 3;
                            break;
                        case '员工风采currency':
                            $scope.currencyType = 4;
                            break;
                        case '培训和发展currency':
                            $scope.currencyType = 5;
                            break;
                        case '企业社会责任currency':
                            $scope.currencyType = 6;
                            break;
                        case '行业殊荣currency':
                            $scope.currencyType = 7;
                            break;
                    }
                })
            }
            $scope.showConfirm();
        }
    }

    function AddCurrencyCtrl($scope, $http, $mdDialog, $location) {

        // //如果返回列表
        // $scope.backClick = function () {
        //     $location.path("/currency/currency-list");
        // }
        $scope.isShow = 0;
        var AuthoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < AuthoritySet.length; i++) {
            if (AuthoritySet[i] == "56") {
                $scope.isShow = 1;
            }
        }
        $scope.currency = {
            'jumpUrl': ''
        };
        $scope.doUploadPhoto = function(element) {
            $scope.imageFileObj = element.files[0];
        }
        $scope.doUploadVideo = function(element) {
            $scope.videoFileObj = element.files[0];
        }

        $scope.currencyName="";
       $scope.currencyLocation="";
       $scope.currencyType="";
       $scope.activated="";
       $scope.startDate="";
       $scope.endDate="";
       $scope.currency={"appId":"","currencyLocation":"","LinkUrl":"","activated":""}
       $scope.platform="";
        

        $scope.searchShow=0;

        //根据应用名称查找
        $scope.searchApp=function(){
             $scope.searchShow=1;
            if ($scope.appName==undefined) {
                $scope.appName="";
            }

            $http.post("http://localhost:8080/applicationMarket-server/"+"app/searchByAppName.do?",{},{params:{
                        appName:$scope.appName,
                        platform:$scope.platform
                    }}).success(function (data){
                        if(data.code == 0){
                            
                            $scope.appInfo=data.result;
                            console.log($scope.appInfo);
                        }else{
                            $scope.appInfo=null;
                        }
                    })



        }


         $scope.clickContent=function(appId){
            console.log(appId);
                for (var i = 0; i < $scope.appInfo.length; i++) {
                    if ($scope.appInfo[i].appId==appId) {
                        // console.log(appId)
                        $scope.appName=$scope.appInfo[i].name;
                        $scope.currency.appId=$scope.appInfo[i].appId;
                        $scope.appInfo=null;
                        $scope.searchShow=0;
                        return;
                    }
                }
            }

            $scope.mouseOver=function(appId){
                $("#app-"+appId).css("background-color","gray");
            }

            $scope.mouseLeave=function(appId){
                $("#app-"+appId).css("background-color","rgb(0,0,0,0)");
            }



        $scope.type="";
        $scope.name="";
        $scope.currencyName="";
        $scope.issuer="";
        $scope.contractAddress="";

        //添加广告
        $scope.addCurrency = function() {
            //console.log($scope.currency.file);
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm().title('是否添加')
                    // .ariaLabel('Lucky day')
                    // .targetEvent(ev)
                    .ok('确定').cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    var addCurrencyUrl = "http://localhost:8080/applicationMarket-server/" + "currency/addCurrency.do"; // 接收上传文件的后台地址

                    var form = new FormData();
                    form.append("type", $scope.type);
                    form.append("name", $scope.name);
                    form.append("contractAddress", $scope.contractAddress);
                    form.append("currencyName", $scope.currencyName);
                    form.append("issuer", $scope.issuer);
                    form.append("logo",$scope.imageFileObj);
                    
                    var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", addCurrencyUrl, true);
                    xhr.send(form);
                    xhr.onreadystatechange = doResult;
                    function doResult() {
                        console.log("cccc---"+xhr.readyState);
                        console.log(xhr.status);
                        if (xhr.readyState == 4) { //4代表执行完成
                            if (xhr.status == 200) { //200代表执行成功
                                //将xmlHttpReg.responseText的值赋给ID为resText的元素
                                var date=eval("("+xhr.responseText+")")
                                // console.log(date);
                                // console.log("--->"+date.code);
                                if(date.code==0){
                                    $scope.showAlert("添加成功");
                                }else{
                                    $scope.showAlert(date.message);
                                    // alert(date.errorMessage);
                                }
                                // console.log("---->"+xhr.responseText);
                               
                            }
                        }
                    }
                }, function() {
                    $scope.showAlert("取消上传");
                });
            };
            $scope.showAlert = function(txt) {
                $mdDialog.show($mdDialog.alert()
                    // .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(false).title(txt).ok('确定')).then(function() {
                    // $location.path('/Currency/currency-list');
                });
            }
            $scope.showConfirm();
        }
    }

    function AddImageCtrl($scope, $http, $mdDialog, $location) {
        $scope.isAddImage = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < authoritySet.length; i++) {
            console.log(authoritySet[i]);
            if (authoritySet[i] == "addImage") {
                $scope.isAddImage = 1;
            }
        }
        $scope.doUploadPhoto = function(element) {
            $scope.fileObj = element.files;
            // console.log("$scope.fileObj");
            var files = $scope.fileObj;
            var files = Array.prototype.slice.call(files);
            // console.log(this);
            if (files.length > 6) {
                alert("最多同时只可上传6张图片");
                return;
            }
            files.forEach(function(file, i) {
                if (!/\/(?:jpeg|png|gif)/i.test(file.type)) return;
                var reader = new FileReader();
                var li = document.createElement("li");
                console.log(li);
                var a = document.createElement('a');
                $('.img-list').append($(li));
                $('.img-list li').append($(a));
                reader.onload = function() {
                    var result = this.result;
                    var img = new Image();
                    img.src = result;
                    console.log(result)
                    $(li).css('background-image', "url(" + result + ")");
                    $(a).text('X').css({
                        display: 'none'
                    });
                    $('.img-list li').hover(function() {
                        $(this).find('a').css({
                            display: 'block'
                        });
                    }, function() {
                        $(this).find('a').css({
                            display: 'none'
                        });
                    });
                    $('.img-list li a').click(function(event) {
                        var i = $(this).parent('li').index();
                        console.log(i);
                        var filearray = $scope.fileObj;
                        console.log(typeof(filearray));
                        $(filearray).splice(i, 1);
                        $(this).parent('li').remove();
                        console.log($scope.fileObj);
                    });
                };
                reader.readAsDataURL(file);
            })
        }
        $scope.addImage = function() {
            //console.log($scope.currency.file);
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm().title('是否上传图片')
                    // .ariaLabel('Lucky day')
                    // .targetEvent(ev)
                    .ok('确定').cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    // $http.post("http://139.196.7.76:8080/chinatravel-server/"+"Currency/addCurrency",{})
                    var addImageUrl = "http://localhost:8080/applicationMarket-server/" + "image/addImage.do"; // 接收上传文件的后台地址
                    // FormData 对象
                    var form = new FormData();
                    //console.log($scope.currency.type);
                    form.append("file", $scope.fileObj);

                    var xhr = new XMLHttpRequest();
                    //console.log('111111111111');
                    var response;
                    xhr.open("post", addImageUrl, true);
                    xhr.send(form);
                    xhr.onreadystatechange = doResult;

                    function doResult() {
                        if (xhr.readyState == 4) { //4代表执行完成
                            if (xhr.status == 200) { //200代表执行成功
                                //将xmlHttpReg.responseText的值赋给ID为resText的元素
                                $scope.showAlert("上传图片成功");
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
                $mdDialog.show($mdDialog.alert()
                    // .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(false).title(txt)
                    // .content('You can specify some description text in here.')
                    // .ariaLabel('Alert Dialog Demo')
                    .ok('确定')
                    // .targetEvent()
                )
                // ).then(function(){
                //     // $('.userForm').reset();
                // })
            }
            $scope.showConfirm();
        }
    }

    function ImageCtrl($scope, $http, $mdDialog, $location, $timeout) {
        $scope.login = function() {
            if (sessionStorage.awardId == undefined) {
                $location.path('/page/signin')
            }
        }
        //$timeout($scope.login(),10)
        var init;
        $scope.stores = [];
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
        $scope.isListImage = 0;
        $scope.isAddImage = 0;
        $scope.isEditImage = 0;
        $scope.isDeleteImage = 0;
        var authoritySet = sessionStorage.authoritySet.split(',');
        for (var i = 0; i < authoritySet.length; i++) {
            if (authoritySet[i] == "listImage") {
                $scope.isListImage = 1;
            } else if (authoritySet[i] == "addImage") {
                $scope.isAddImage = 1;
            } else if (authoritySet[i] == "editImage") {
                $scope.isEditImage = 1;
            } else if (authoritySet[i] == "deleteImage") {
                $scope.isDeleteImage = 1;
            }
        }

        function getAwardList(pageNum, pageSize) {
            $http.post('http://localhost:8080/applicationMarket-server/' + 'image/getImageList.do', {}, {
                params: {
                    pageNum: pageNum,
                    pageSize: pageSize
                }
            }).success(function(data) {
                if (data.errorCode == 0) {
                    $scope.stores = data.result;
                    $scope.currentPageStores = data.result;
                    $scope.filteredStores = data.result;
                    $scope.currentPageStores.$apply;
                    $scope.total = data.total;
                    console.log($scope.stores);
                };
            });
        }

        function select(page) {
            var end, start;
            start = (page - 1) * $scope.numPerPage;
            end = start + $scope.numPerPage;
            getAwardList(page, $scope.numPerPage);
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
            $scope.filteredStores = $scope.stores;
            //console.log($scope.stores);
            return $scope.onFilterChange();
        };
        init = function() {
            console.log($scope.numPerPage);
            $http.post('http://localhost:8080/applicationMarket-server/' + 'image/getImageList.do', {}, {
                params: {
                    pageNum: 1,
                    pageSize: $scope.numPerPage,
                }
            }).success(function(data) {
                if (data.errorCode == 0) {
                    $scope.stores = data.result;
                    $scope.total = data.total;
                    console.log($scope.stores);
                    $scope.search();
                    $scope.currentPageStores = $scope.stores;
                };
            });
        };
        // 删除管理员
        $scope.deleteImage = function(id) {
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm().title('是否确定删除该条图片信息')
                    // .ariaLabel('Lucky day')
                    // .targetEvent(ev)
                    .ok('确定').cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    $http.post("http://localhost:8080/applicationMarket-server/" + "image/deleteImage.do?", {}, {
                        params: {
                            imageId: id
                        }
                    }).success(function(data) {
                        if (data.errorCode == 0) {
                            $scope.showAlert("删除图片成功");
                            $(".delete-" + id).css("display", "none");
                            $scope.total--;
                        } else {
                            $scope.showAlert(data.errorMessage);
                        }
                    })
                }, function() {
                    $scope.showAlert("取消删除");
                });
            };
            $scope.showAlert = function(txt) {
                $mdDialog.show($mdDialog.alert().clickOutsideToClose(false).title(txt).ok('确定'))
            }
            $scope.showConfirm();
        }
        //修改密码
        $scope.awardId = $location.search().id;
        $scope.awardName = $location.search().name;
        $scope.changeAward = function() {
            $scope.showConfirm = function() {
                // 确定
                var confirm = $mdDialog.confirm().title('是否确定修改密码')
                    // .ariaLabel('Lucky day')
                    // .targetEvent(ev)
                    .ok('确定').cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    $http.post("http://localhost:8080/applicationMarket-server/" + "award/modifyAward.do?", {}, {
                        params: {
                            awardId: $scope.awardId,
                            awardName: $scope.awardName,
                            awardContent: $scope.awardContent
                        }
                    }).success(function(data) {
                        if (data.errorCode == 0) {
                            $scope.showAlert("奖品修改成功");
                        } else {
                            $scope.showAlert1(data.errorMessage);
                        }
                    })
                }, function() {
                    $scope.showAlert("取消修改");
                });
            };
            $scope.showAlert = function(txt) {
                $mdDialog.show($mdDialog.alert().clickOutsideToClose(false).title(txt).ok('确定')).then(function() {
                    $location.path('/award/award-list')
                })
            }
            $scope.showAlert1 = function(txt) {
                $mdDialog.show($mdDialog.alert().clickOutsideToClose(false).title(txt).ok('确定'))
            }
            $scope.showConfirm();
        }
        $scope.backClick = function() {
            $location.path("/image/image-list");
        }
        init();
    }

function ChangeCurrencyCtrl($scope,$http,$location,$mdDialog,$timeout){
    $scope.login = function(){
        if(sessionStorage.adminId == undefined){
            $location.path('')
        }
    }
    $scope.currencyId = $location.search().id;
    $http.post("http://localhost:8080/applicationMarket-server/"+"currency/getCurrencyById.do?",{},{params:{
        currencyId:$scope.currencyId
    }}).success(function (data){
        if(data.code == 0){
            console.log(data.result);
            $scope.currency=data.result;
            // console.log($scope.currency);
            // console.log($scope.currency);
            // console.log("  " + $scope.currency);
        } else {
            $scope.showAlert1(data.message)
        }                        
    })

        $scope.searchShow=0;
        $scope.selectShow=0;
        $scope.appId="";  //应用的Id

        $scope.modApp=function(){
            $scope.selectShow=1;
        }

        //根据应用名称查找
        $scope.searchApp=function(){
             $scope.searchShow=1;
            if ($scope.appName==undefined) {
                $scope.appName="";
            }

            $http.post("http://localhost:8080/applicationMarket-server/"+"app/searchByAppName.do?",{},{params:{
                        appName:$scope.appName,
                        platform:$scope.app.plateform
                    }}).success(function (data){
                        if(data.code == 0){
                            
                            $scope.appInfo=data.result;
                            console.log($scope.appInfo);
                        }else{
                            $scope.appInfo=null;
                        }
                    })



        }

        $scope.doUploadPhoto = function(element) {
                $scope.imageFileObj = element.files[0];
        }


         $scope.clickContent=function(appId){
            console.log(appId);
                for (var i = 0; i < $scope.appInfo.length; i++) {
                    if ($scope.appInfo[i].appId==appId) {
                        // console.log(appId)
                        $scope.appName=$scope.appInfo[i].name;
                        $scope.appId=$scope.appInfo[i].appId;
                        $scope.appInfo=null;
                        $scope.searchShow=0;
                        return;
                    }
                }
            }

            $scope.mouseOver=function(appId){
                $("#app-"+appId).css("background-color","gray");
            }

            $scope.mouseLeave=function(appId){
                $("#app-"+appId).css("background-color","rgb(0,0,0,0)");
            }


            $scope.doUploadPhoto = function(element) {
                $scope.imageFileObj = element.files[0];
        }



    $scope.changeCurrency = function(){
        console.log($scope.currency.currencyId+"---"+$scope.currency.currencyLocation+"---"+$scope.currency.linkUrl+"---"+$scope.currency.activated+"---"+$scope.currency.currencyLocation);
        $scope.showConfirm = function() {
                            // 确定
                            var confirm = $mdDialog.confirm()
                            .title('是否确定修改')
                            // .ariaLabel('Lucky day')
                            // .targetEvent(ev)
                            .ok('确定修改')
                            .cancel('取消修改');
                            $mdDialog.show(confirm).then(function() {
                    // console.log('确定')
                    var changeCurrencyUrl ="http://localhost:8080/applicationMarket-server/" + "currency/modifyCurrency.do?";

                    var form = new FormData();
                    form.append("type", $scope.currency.type);
                    form.append("name", $scope.currency.name);
                    form.append("currencyId", $scope.currency.id);
                    form.append("contractAddress", $scope.currency.contractAddress);
                    form.append("currencyName", $scope.currency.currencyName);
                    form.append("issuer", $scope.currency.issuer);
                    form.append("logo",$scope.imageFileObj);

                    var xhr = new XMLHttpRequest();
                    var response;
                    xhr.open("post", changeCurrencyUrl, true);

                    xhr.send(form);

                    xhr.onreadystatechange = doResult;

                    function doResult() {

                        if (xhr.readyState == 4) { //4代表执行完成
                            if (xhr.status == 200) { //200代表执行成功
                                //将xmlHttpReg.responseText的值赋给ID为resText的元素
                                var date=eval("("+xhr.responseText+")")
                                // console.log(date);
                                // console.log("--->"+date.code);
                                if(date.code==0){
                                    $scope.showAlert("修改成功");
                                    // // console.log("广告上传成功");
                                    // alert("广告上传成功");
                                }else{
                                    $scope.showAlert(date.message);
                                    // alert(date.errorMessage);
                                }
                                // console.log("---->"+xhr.responseText);
                               
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
                       // $location.path('/currency/currency-list');
                   }) 
                }    
                $scope.showConfirm();
            }
            $scope.backClick = function(){
                $location.path("/currency/currency-list");
            }

        }



})();