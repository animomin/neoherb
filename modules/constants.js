var neoProcedure = [];
neoProcedure.getPharmIDCheck = 'sP_NEOHERB약업사아이디중복체크';
neoProcedure.PharmRegister = 'sP_NEOHERB약업사등록';
neoProcedure.PharmCreateDatabase = 'sP_NEOHERB약업사데이터생성';
neoProcedure.PharmInfo = 'sP_NEOHERB약업사정보';
neoProcedure.PharmInfoUpdate = 'sP_NEOHERB약업사정보수정';
neoProcedure.PharmList = 'sP_NEOHERB약업사리스트';
neoProcedure.PharmListCount = 'sP_NEOHERB약업사리스트수';
neoProcedure.ClientAdd = 'sP_NEOHERB약업사거래처등록';
neoProcedure.ClientUpdate = 'sP_NEOHERB약업사거래처수정';
neoProcedure.ClientDelete = 'sP_NEOHERB약업사거래처삭제';
neoProcedure.ClientList = 'sP_NEOHERB약업사거래처리스트';
neoProcedure.ClientListCount = 'sP_NEOHERB약업사거래처리스트수';
neoProcedure.ClientInfo = 'sP_NEOHERB약업사거래처상세조회';
neoProcedure.PrescriptionList = 'sP_NEOHERB약업사처방전리스트';
neoProcedure.PrescriptionListCount = 'sP_NEOHERB약업사처방전리스트수';
neoProcedure.PrescriptionDetailInfo = 'sP_NEOHERB약업사처방전상세조회';
neoProcedure.DrugInfoAdd = 'sP_NEOHERB약업사본초등록';
neoProcedure.DrugInfoList = 'sP_NEOHERB약업사본초리스트';
neoProcedure.DrugInfoListCount = 'sP_NEOHERB약업사본초리스트수';
neoProcedure.DrugInfoUpdateHistory = 'sP_NEOHERB약업사본초내역리스트';
neoProcedure.DrugInfoUpdateHistoryCount = 'sP_NEOHERB약업사본초내역리스트수';
neoProcedure.DeadlineList = 'sP_NEOHERB약업사처방전결산';
neoProcedure.DeadlineListCount = 'sP_NEOHERB약업사처방전결산수';
neoProcedure.StatList = 'sP_NEOHERB약업사처방전집계';
neoProcedure.StatListCount = 'sP_NEOHERB약업사처방전집계수';

neoProcedure.DrugMasterList = 'sP_NEOHERB중계본초마스터리스트';
neoProcedure.DrugMasterListCount = 'sP_NEOHERB중계본초마스터리스트수';
neoProcedure.MasterNoticeList = 'sP_NEOHERB중계공지사항리스트';
neoProcedure.MasterNoticeAdd = 'sP_NEOHERB중계공지사항등록';

neoProcedure.getHospCheck = 'sP_NEOHERB한의원중복체크';
neoProcedure.HospRegister = 'sP_NEOHERB한의원등록';
neoProcedure.HospInformation = 'sP_NEOHERB한의원정보';
neoProcedure.HospPharmList = 'sP_NEOHERB한의원약업사리스트';
neoProcedure.HospPharmListCount = 'sP_NEOHERB한의원약업사리스트수';
neoProcedure.HospPharmAdd = 'sP_NEOHERB한의원거래처등록';
neoProcedure.HospPharmDelete = 'sP_NEOHERB한의원거래처삭제';  //T_한의원거래처 테이블에서 상태가 0 일때만 delete
neoProcedure.HospPharmBan = 'sP_NEOHERB한의원거래처강제삭제'; //T_한의원거래처 테이블에서 상태를 2로 바꿈.
neoProcedure.HospGetPrescriptionKey = 'sP_NEOHERB한의원처방전키조회';
neoProcedure.HospAddPrescription = 'sP_NEOHERB한의원처방전저장';
neoProcedure.HospAddPrescriptionDrug = 'sP_NEOHERB한의원처방전본초저장';
neoProcedure.HospAddPrescriptionCost = 'sP_NEOHERB한의원처방전비용저장';
neoProcedure.HospDeletePrescription = 'sP_NEOHERB한의원처방전삭제';
neoProcedure.HospPharmDruglist = 'sP_NEOHERB한의원약업사단가리스트';
neoProcedure.HospPharmDruglistCount = 'sP_NEOHERB한의원약업사단가리스트수';
neoProcedure.HospPromiseDrugList = 'sP_NEOHERB한의원약속처방리스트';
neoProcedure.HospPromiseDrugListCount = 'sP_NEOHERB한의원약속처방리스트수';
neoProcedure.HospPromiseDrugAdd = 'sP_NEOHERB한의원약속처방등록';
neoProcedure.HospPromiseDrugDelete = 'sP_NEOHERB한의원약속처방삭제';
neoProcedure.HospMarketProductList = 'sP_NEOHERB본초시세조회';
neoProcedure.HospMarketOrderHistory = 'sP_NEOHERB한의원약재장터주문내역';
neoProcedure.HospMarketOrder = 'sP_NEOHERB한의원약재장터주문';
neoProcedure.HospMarketOrderProducts = 'sP_NEOHERB한의원약재장터주문물품등록'


var neoPViews = {};
neoPViews.SIGNUP = 0;         // 가입 화면
neoPViews.SIGNUPSUCEESS = 1;  // 가입 성공
neoPViews.PHARMINDEX = 2;          // 약업사 인덱스
neoPViews.PHARMNOTICEMANAGE = 3;    // 약업사 공지관리
var neoMenuID = {};
neoMenuID.PHARM = {};
neoMenuID.HOSP = {};
neoMenuID.ADMIN = {};
neoMenuID.MAINPAGE = 1; // 약업사, 한의원 네오뉴스
neoMenuID.PHARM.SIGNUP = 0;     //약업사 가입신청
neoMenuID.PHARM.NOTICEMANAGE = 2; // 약업사 공지관리
neoMenuID.PHARM.NOTICEMANAGE_LIST = 21;  //약업사 공지 리스트
neoMenuID.PHARM.NOTICEMANAGE_VIEW = 22;  //약업사 공지 뷰
neoMenuID.PHARM.NOTICEMANAGE_WRITE = 23; //약업사 공지 작성
neoMenuID.HOSP.MARKET = 3; // 한의원 약재장터
neoMenuID.HOSP.MARKET_LIST = 31; // 한의원 약재장터 메인
neoMenuID.HOSP.MARKET_CART = 32; // 한의원 약재장터 장바구니
neoMenuID.ADMIN.NEWS = 1;
neoMenuID.ADMIN.NEWS_LIST = 11;
neoMenuID.ADMIN.NEWS_WRITE = 12;
neoMenuID.ADMIN.NEWS_VIEW = 13;

exports.neoMenuID = neoMenuID;
exports.neoPViews = neoPViews;
exports.neoProc = neoProcedure;
exports.SUCCESS = "SUCCESS";
exports.UPDATESUCCESS = "UPDATE SUCCESS";
exports.INSERTSUCCESS = "INSERT SUCCESS";
exports.DELETESUCCESS = "DELETE SUCCESS";
exports.NODATA = "NODATA";
exports.DISCONNECTION = "DISCONNECTION";
