module.exports=class APIFeatures{
    length=0;
    constructor(query,queryString){
        this.query = query;
        this.queryString = queryString;
    }

    filter(){
        const queryObj = {...this.queryString};
        // to check on thos we check on the req.query
        const execlude = ['page','sort','order','limit'];
        execlude.forEach(el=> delete queryObj[el]);
        //* advanced filtering
        let queryStr = JSON.stringify(queryObj);   
        if(queryObj['name']){
            console.log(`name is ${queryObj['name']}`);
            const regex = new RegExp(`^${queryObj['name']}`, 'i');
            this.query =  this.query.find({ name: { $regex: regex } });
            return this;
        }
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`);
        
        this.query =  this.query.find(JSON.parse(queryStr));  // if we await here we can't chain other query functions

        return this;
    }

    sort(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
            }
            else{
                this.query = this.query.sort('-creationDate');
            }
            return this;
    }

    limitFields(){
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }else{
            // to not send this in the response 
            this.query = this.query.select('-__v');
        }
        return this;
    }

    paginate(){
        const page = this.queryString.page || 1;
        const limit = this.queryString.limit || 100;
        const skip = (page-1)*limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}