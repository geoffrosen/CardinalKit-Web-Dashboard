import request from "@/Rest";
export const FetchSurveyByStudy = async ({ commit }, {studyId}) => {
  let surveysList = []
  let surveysListData = []
  let surveysSnap = await request.GET(`studies/${studyId}/surveys`).Execute()
  surveysSnap.forEach((survey)=>{
    surveysList.push(survey.id)
    if(Object.keys(survey.data()).length){
      surveysListData.push(survey.data())
    }
  })
  commit("saveSurveysList",{idStudy:studyId,surveys:surveysList})
  commit("saveSurveysListData",{idStudy:studyId,surveys:surveysListData})
};

  export const FetchSurveyAllData = async ({commit},{studyId,surveyId})=>{
    let QuestionsResults=[]
    let users = await request.GET(`studies/${studyId}/users`).Execute()
    await Promise.all(users.docs.map(async(user)=>{
      let surveyData = await request.GET(`studies/${studyId}/users/${user.id}/surveys/${surveyId}`).Execute()
      if(surveyData.exists){
        let dataResuls = surveyData.data().results
        dataResuls["userId"] = user.id
        QuestionsResults.push(dataResuls)
      }
    }))
    commit("saveSurveyDetail",{results:QuestionsResults,surveyId:surveyId,studyId:studyId})
  }

export const FetchSurveyUserData = async ({commit},{studyId,userId})=>{
  let surveyResults={}
 // let surveyResultsData=[]
  let surveysSnap = await request.GET(`studies/${studyId}/surveys`).Execute()
  await Promise.all( surveysSnap.docs.map(async(survey)=>{
    let surveyData = await request.GET(`studies/${studyId}/users/${userId}/surveys/${survey.id}`).Execute()

    if(surveyData.exists){
      surveyResults[survey.id]=surveyData.data().results
    }
  }))
  console.log("userId",userId)
  commit("saveUserSurveys",{results:surveyResults,userId:userId})
}

export const FetchSurveyBuilderUser = async ({commit},{studyId})=>{
  let surveyResults={}
  let surveysSnap = await request.GET(`studies/${studyId}/surveys`).Execute()
  await Promise.all(surveysSnap.docs.map(async(survey)=>{
    let surveyData = await request.GET(`studies/${studyId}/surveys/${survey.id}/questions`).Execute()
    if (surveyData.docs.length){
      surveyData.docs.map((o) => {
        surveyResults[survey.id]=o.data()
      })
    }
  }))
  //console.log(surveyResults, "surveyResults")
  commit("saveSurveysBuilderUser",{results:surveyResults})
}

//Data format
/* {
    studyId: ...,
    name: ...,
    questions: [
      identifier: ..,
      question: ..,
      options:[
        {
          name: ..,
          value: ..
        },
        {
          name: ..,
          value: ..
        }
      ]
    ],
    ...
  }
}*/
export const SaveSurvey = async({commit},data)=>{
  let surveyName = data.name
  let studyId = data.studyId
  console.log("post in",`studies/${studyId}/surveys/${surveyName}`)
  await request.POST(`/studies/${studyId}/surveys/${surveyName}`,{
    data:data.data
  }).Execute()
  console.log(data)
  Object.keys(data.questions).forEach(async key => {
    let element = data.questions[key]
    await request.POST(`studies/${studyId}/surveys/${surveyName}/questions/${element.id}`,{
      data:element
    }).Execute()
  })
}