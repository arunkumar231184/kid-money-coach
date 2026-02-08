import { describe, it, expect } from "vitest";
import { BankConnection } from "./useBankConnections";

describe("BankConnection interface", () => {
  it("should have correct shape for active connection", () => {
    const connection: BankConnection = {
      id: "123",
      kid_id: "kid-456",
      provider: "truelayer",
      account_id: "acc-789",
      account_name: "Current Account",
      bank_name: "Test Bank",
      connected_at: "2024-01-01T00:00:00Z",
      last_synced_at: "2024-01-02T00:00:00Z",
      status: "active",
    };

    expect(connection.status).toBe("active");
    expect(connection.provider).toBe("truelayer");
  });

  it("should allow null values for optional fields", () => {
    const connection: BankConnection = {
      id: "123",
      kid_id: "kid-456",
      provider: "truelayer",
      account_id: null,
      account_name: null,
      bank_name: null,
      connected_at: "2024-01-01T00:00:00Z",
      last_synced_at: null,
      status: "expired",
    };

    expect(connection.account_id).toBeNull();
    expect(connection.account_name).toBeNull();
    expect(connection.bank_name).toBeNull();
    expect(connection.last_synced_at).toBeNull();
  });

  it("should support all status types", () => {
    const statuses: BankConnection["status"][] = ["active", "expired", "revoked"];
    
    statuses.forEach((status) => {
      const connection: BankConnection = {
        id: "123",
        kid_id: "kid-456",
        provider: "truelayer",
        account_id: null,
        account_name: null,
        bank_name: null,
        connected_at: "2024-01-01T00:00:00Z",
        last_synced_at: null,
        status,
      };
      expect(connection.status).toBe(status);
    });
  });
});
