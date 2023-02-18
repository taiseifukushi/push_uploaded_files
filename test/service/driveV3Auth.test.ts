import { driveV3Service } from "../../src/service/driveV3Auth";

describe("driveV3Service", () => {
	it("should create a drive v3 service", () => {
		expect(driveV3Service).toBeDefined();
	});
});
