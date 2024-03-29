import request from "@/Rest";

export const FetchCategoryTypeData = async (  
  categoryType,
  payload
) => {
  let filterParams = [
    ["body.category_type","==",categoryType],    
  ]
  return await FetchGeneralData({...payload,filterParams})
};

//TODO how is sample data export
export const FetchSampleData = async(

)=>{

};

export const FetchLastQuantityData = async(
  quantity_type,
  payload
)=>{
  let lastRecord = await FetchQuantityData(quantity_type,payload)
  
  if(lastRecord.length>0){
    let date = new Date(lastRecord[0].header.creation_date_time)
    date.setHours(0,0,0)
    let endDate = new Date(date)
    endDate.setHours(23,59,59)

    let filterParams = [
      ["body.quantity_type","==",quantity_type],
      ["header.creation_date_time", ">=", date.toISOString()],
      ["header.creation_date_time", "<=", endDate.toISOString()],
    ]
    delete payload['limit']
    return await FetchGeneralData({...payload,filterParams})
  }
  else{
    return lastRecord
  }
}

export const FetchQuantityData = async(
  quantity_type,
  payload
) => {
  let filterParams = [
    ["body.quantity_type","==",quantity_type]
  ]
  return await FetchGeneralData({...payload,filterParams})
};

export const FetchActivities = async(payload)=>{
  let snapShot =  await request
    .GET(`studies/${payload.studyId}/users/${payload.userId}/healthKit`)
    .WHERE(["body.activity_name","!=",null])
    .ORDER_BY("body.activity_name")
    .ORDER_BY('header.creation_date_time',true)
    .LIMIT(payload.limit)
    .Execute()
    let records = snapShot.docs.map((record) => {
      return record.data();
    });
    return records
}

const FetchGeneralData = async (payload) => { 
  let Ref = request.GET(`studies/${payload.studyId}/users/${payload.userId}/healthKit`)
  payload.filterParams.forEach(element => {    
    Ref=Ref.WHERE(element)
  });
  if(payload.limit != 0){

    Ref = Ref.ORDER_BY('header.creation_date_time',true).LIMIT(payload.limit)
  }
  let userSnap = await Ref
    .Execute()
  let records = userSnap.docs.map((record) => {
    return record.data();
  });
  return records
};

export const initialState = () => ({
  healthData: {},
  userMetricData:[]
});

export default {
  namespaced: true,
  state: initialState(),
  mutations:
  {
    ...require("./HealthData/mutations"),
    ...require("./HealthData/Activity/mutations"),
    ...require("./HealthData/Hearing/mutations"),
  },
  actions: {
    ...require("./HealthData/actions"),
    ...require("./HealthData/Activity/actions"),
    ...require("./HealthData/BodyMeasurements/actions"),
    ...require("./HealthData/Hearing/actions"),
    ...require("./HealthData/Heart/actions"),
    ...require("./HealthData/Mindfulness/actions"),
    ...require("./HealthData/Mobilitiy/actions"),
    ...require("./HealthData/Nutrition/actions"),
    ...require("./HealthData/Respiratory/actions"),
    ...require("./HealthData/Sleep/actions"),
    ...require("./HealthData/Symtoms/actions"),
    ...require("./HealthData/Vitals/actions"),
    ...require("./HealthData/Other/actions"),
  },
  getters:{
    ...require("./HealthData/getters"),
    ...require("./HealthData/Activity/getters"),
    ...require("./HealthData/Hearing/getters"),
    
  }
};