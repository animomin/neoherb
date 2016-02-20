var neoProcedure = [];
neoProcedure.getPharmIDCheck = 'sP_NEOHERB약업사아이디중복체크';
neoProcedure.PharmRegister = 'sP_NEOHERB약업사등록';
neoProcedure.PharmInfo = 'sP_NEOHERB약업사정보';
neoProcedure.PharmList = 'sP_NEOHERB약업사리스트';
neoProcedure.PharmListCount = 'sP_NEOHERB약업사리스트수';
neoProcedure.ClientAdd = 'sP_NEOHERB약업사거래처등록';
neoProcedure.ClientList = 'sP_NEOHERB약업사거래처리스트';
neoProcedure.ClientListCount = 'sP_NEOHERB약업사거래처리스트수';
neoProcedure.ClientInfo = 'sP_NEOHERB약업사거래처상세조회';
neoProcedure.PrescriptionList = 'sP_NEOHERB약업사처방전리스트';
neoProcedure.PrescriptionListCount = 'sP_NEOHERB약업사처방전리스트수';
neoProcedure.PrescriptionDetailInfo = 'sP_NEOHERB약업사처방전상세조회';
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

neoProcedure.getHospCheck = 'sP_NEOHERB한의원중복체크';
neoProcedure.HospRegister = 'sP_NEOHERB한의원등록';
neoProcedure.HospPharmList = 'sP_NEOHERB한의원약업사리스트';
neoProcedure.HospPharmListCount = 'sP_NEOHERB한의원약업사리스트수';
neoProcedure.HospPharmAdd = 'sP_NEOHERB한의원거래처등록';
neoProcedure.HospPharmDelete = 'sP_NEOHERB한의원거래처삭제';  //T_한의원거래처 테이블에서 상태가 0 일때만 delete
neoProcedure.HospPharmBan = 'sP_NEOHERB한의원거래처강제삭제'; //T_한의원거래처 테이블에서 상태를 2로 바꿈.
neoProcedure.HospGetPrescriptionKey = 'sP_NEOHERB한의원처방전키조회';
neoProcedure.HospAddPrescription = 'sP_NEOHERB한의원처방전저장';
neoProcedure.HospAddPrescriptionDrug = 'sP_NEOHERB한의원처방전본초저장';
neoProcedure.HospAddPrescriptionCost = 'sP_NEOHERB한의원처방전비용저장';
neoProcedure.HospPharmDruglist = 'sP_NEOHERB한의원약업사단가리스트';
neoProcedure.HospPharmDruglistCount = 'sP_NEOHERB한의원약업사단가리스트수';



exports.neoProc = neoProcedure;
exports.SUCCESS = "SUCCESS";
exports.UPDATESUCCESS = "UPDATE SUCCESS";
exports.INSERTSUCCESS = "INSERT SUCCESS";
exports.DELETESUCCESS = "DELETE SUCCESS";
exports.NODATA = "NODATA";
exports.DISCONNECTION = "DISCONNECTION";
