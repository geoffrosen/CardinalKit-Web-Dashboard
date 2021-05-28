/*
    CustomDataFormat
    {
        HkCode :  String,
        HkValue : String,
        Date : Date,
        Value: Integer,
        Unit : String,
        id: String
        //If has duration 
        startDate: date
        endDate: date
    }
*/

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];


// TODO There is a case with distance duration and kcal  

export const transformHealthDataToGlobalFormat = (data) => {
  let HkCode,
    HkCodeName,
    HkValue,
    Date,
    Value,
    Unit,
    Id,
    StartDate,
    EndDate,
    ExtraData = null;

  //HkCode
  if (data.body.category_type) {
    HkCode = data.body.category_type;
    HkValue = data.category_value;
  }
  if (data.body.quantity_type) {
    HkCode = data.body.quantity_type;
  }

  if(data.body.activity_name){
    HkCode = data.body.activity_name;

    //if is activity has 3 types of data
    ExtraData = {}
    if(data.body.distance){
      ExtraData["distance"]=data.body.distance
    }

    if(data.body.duration){
      ExtraData["duration"]=data.body.duration
    }

    if(data.body.kcal_burned){
      ExtraData["kcal_burned"]=data.body.kcal_burned
    }

  }

  HkCodeName=transformAppleCode(HkCode)

  //Date
  Date = data.header.creation_date_time.toDate();

  console.log(data.body)
  //Unit and value

  if (data.body.kcal_burned) {
    Unit = data.body.kcal_burned.unit;
    Value = data.body.kcal_burned.value;
  }
  if (data.body.body_temperature) {
    Unit = data.body.body_temperature.unit;
    Value = data.body.body_temperature.value;
  }
  if (data.body.unit_value) {
    Unit = data.body.unit_value.unit;
    Value = data.body.unit_value.value;
  }
  if (data.body.blood_glucose) {
    Unit = data.body.blood_glucose.unit;
    Value = data.body.blood_glucose.value;
  }
  if (data.body.body_fat_percentage) {
    Unit = data.body.body_fat_percentage.unit;
    Value = data.body.body_fat_percentage.value;
  }
  if (data.body.body_mass_index) {
    Unit = data.body.body_mass_index.unit;
    Value = data.body.body_mass_index.value;
  }
  if (data.body.body_weight) {
    Unit = data.body.body_weight.unit;
    Value = data.body.body_weight.value;
  }
  if (data.body.count) {
    Value = data.body.count;
  }
  if (data.body.body_height) {
    Unit = data.body.body_height.unit;
    Value = data.body.body_height.value;
  }
  if (data.body.oxygen_saturation) {
    Unit = data.body.oxygen_saturation.unit;
    Value = data.body.oxygen_saturation.value;
  }
  if (data.body.respiratory_rate) {
    Unit = data.body.respiratory_rate.unit;
    Value = data.body.respiratory_rate.value;
  }
  if (data.body.step_count) {
    Unit = "Steps";
    Value = data.body.step_count;
  }
  if (data.body.distance) {
    Unit = data.body.distance.unit;
    Value = data.body.distance.value;
  }
  if (data.body.duration) {
    Unit = data.body.duration.unit;
    Value = data.body.duration.value;
  }
  //Dates
  if (data.body.effective_time_frame.time_interval) {
    StartDate = data.body.effective_time_frame.time_interval.start_date_time;
    EndDate = data.body.effective_time_frame.time_interval.end_date_time;
  }

  //Id
  Id = data.header.id;
  
  return {
    HkCode: HkCode,
    HkCodeName: HkCodeName,
    HkValue: HkValue,
    Date: {Date,formatted:Date.getDate()+" "+monthNames[Date.getMonth()]},
    Value: Value,
    Unit: Unit,
    Id: Id,
    StartDate: StartDate,
    EndDate: EndDate,
    Logo:require("@/assets/icons/Flame.png"),
    Color: "red"
  };
};

export const transformAppleCode = (appleCode) => {
  return appleCode
    .replace("HKQuantityTypeIdentifier", "")
    .replace("HKCategoryTypeIdentifier", "")
    .replace(/([A-Z]+)/g, " $1")
    .replace(/([A-Z][a-z])/g, " $1");
};