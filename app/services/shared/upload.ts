export class Upload {
    $key:string;
    progress:number;
    name:string;
    url:string;
    file:File;
    createAt:Date = new Date();
    constructor(file:File){
        this.file = file
    }
}
