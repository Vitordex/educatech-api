import should from 'should';

export class RouteTests {
    public static testError(status: number, message: string, error: any) {
        should.equal(error.status, status);
        should.equal(error.message, message);
        error.should.have.property('err');
    }
}
