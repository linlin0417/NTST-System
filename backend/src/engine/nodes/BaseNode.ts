export abstract class BaseNode {
    id: string;
    data: any;

    constructor(id: string, data: any) {
        this.id = id;
        this.data = data;
    }

    abstract execute(context: any): Promise<any>;
}
