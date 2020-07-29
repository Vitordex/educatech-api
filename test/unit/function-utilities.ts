import sinon from "sinon";

export class FunctionUtils {
    public static nameAsAny(method: Function) : any {
        return method.name;
    }

    public static stubMethod(object: Object, method: Function) {
        return sinon.stub(object, FunctionUtils.nameAsAny(method));
    }
}