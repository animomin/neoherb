var resultSet = {
    status : "",
    message : "",
    datacount : 0,
    dataTotalCount : 0,
    currentpage : 0,
    jsData : null
};

exports.init = function(){
  resultSet.status = "";
  resultSet.message = "";
  resultSet.datacount = 0;
  resultSet.dataTotalCount = 0;
  resultSet.currentpage = 0;
  resultSet.jsData  = [];
};

exports.set = function(key,value){
  resultSet[key] = value;
};

exports.get = function(key){
  return resultSet[key];
};

exports.getAll = function(){
  return resultSet;
};

exports.prescriptionInfo = {
  처방정보 : {},
  메모 : {},
  비용 : {},
  배송 : {},
  약재단가 : [],
  복약법 : "",
  처방정보키 : ["처방전이름","전송일자","한의원이름",
               "한의사","한의원연락처","첩수","팩수",
               "복용일수","팩당용량"],
  메모키 : ["처방메모","기타메모","배송메모","사용자메모"],
  비용키 : ["기타비용","박스비용","약재비용","용지비용",
           "입력비용","조제비용","탕전비용","탕전추가비용",
           "파우치비용"],
  //배송키 : ["환자이름","환자연락처","우편번호","기본주소","상세주소"],
  배송키 : ["주문자", "받는사람", "연락처", "성별", "나이", "우편번호", "기본주소", "상세주소"],
  init : function(){
    처방정보 = {};
    메모 = {};
    비용 = {};
    배송 = {};
    약재단가 = [];
    복약법 = "";
  },
  setData : function(data){
    this.init();
    this.약재단가 = data[1];
    this.복약법 = data[0][0]["복약법"] || "";
    for(var rs in data[0][0]){
      if(this.처방정보키.indexOf(rs) >= 0){
        this.처방정보[rs] = data[0][0][rs];
      }else if (this.메모키.indexOf(rs) >= 0) {
        this.메모[rs] = data[0][0][rs];
      }else if (this.비용키.indexOf(rs) >= 0) {
        this.비용[rs] = data[0][0][rs];
      }else if (this.배송키.indexOf(rs) >= 0){
        this.배송[rs] = data[0][0][rs];
      }
    }
    return this.jsonObject();
  },

  jsonObject : function(){
    var resultSet = {};
    resultSet.처방정보 = this.처방정보;
    resultSet.메모 = this.메모;
    resultSet.비용 = this.비용;
    resultSet.배송 = this.배송;
    resultSet.약재단가 = this.약재단가;
    resultSet.복약법 = this.복약법;
    return resultSet;
  }

};

exports.deadline = {
  deadlineSet :[],
  처방전정보 : {},
  한의원정보 : {},
  비용정보 : {},
  처방정보키 : ["처방전키","처방전이름","전송일자","결산상태","첩수","팩수","받는사람","기타메모"],
  한의원정보키 : ["한의원키","한의원이름","한의사"],
  비용정보키 :["조제비용","약재비용","탕전비용","탕전추가비용","파우치비용","박스비용","배송비용","용지비용","기타비용","입력비용"],
  init : function(){
    //deadlineSet =[];
    처방전정보 = {};
    한의원정보 = {};
    비용정보 = {};
  },
  setData : function(data){
    deadlineSet = new Array(data[0].length);
    for(var rs in data[0]){
      this.init();
      for(var subRs in data[0][rs]){
        if(this.처방정보키.indexOf(subRs) >= 0){
          this.처방전정보[subRs] = data[0][rs][subRs];
        }else if (this.한의원정보키.indexOf(subRs) >= 0) {
          this.한의원정보[subRs] = data[0][rs][subRs];
        }else if (this.비용정보키.indexOf(subRs) >= 0) {
          this.비용정보[subRs] = data[0][rs][subRs];
        }
      }
      deadlineSet[rs] = JSON.parse(JSON.stringify(this.jsonObject()));
    }
    return deadlineSet;
  },
  jsonObject : function(){
    var resultSet = {};
    resultSet.처방전정보 = this.처방전정보;
    resultSet.한의원정보 = this.한의원정보;
    resultSet.비용정보 = this.비용정보;
    //resultSet.복약법 = this.복약법;
    return resultSet;
  }
};
