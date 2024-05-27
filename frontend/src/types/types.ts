export interface UserType {
    username : string,
    _id : string ,
    createdAt : Date,
    updatedAt : Date,
    account_type : string,
    account_membership : string,
    membership_plan_id : string | Object,
    email : string,
}

export interface projectType {
    title: string,
    description: string,
    features: Array<featuresProps>,
    members : Array<UserType>,
    space_used : Number,
    createdAt : Date,
    updatedAt : Date,
    start_date? : Date,
    end_date? : Date,
    _id : string ,
    creatorid : UserType
}
export interface featuresProps {
    status : string | any,
    title : string,
    description : string,
    project_id : string,
    updatedAt : string,  
    createdAt : string,  
    start_date? : Date,
    end_date? : Date,
    _id : string ,
    creatorid : UserType,
    assigned : UserType
}
export interface KanbanCardType {
    item: featuresProps,
    parent: string,
    title: string,
    index: number,
    removeCard: (_id: string) => void,
    loadFeatures: () => void,
    project : projectType
}

export interface MindMapType{
  _id : string,
  title : string,
  thumbnail : string,
  data : string | JSON,
  creatorid : string | UserType
}