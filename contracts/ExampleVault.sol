// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

/// @title  ExampleVault
/// @notice A tiny stub used only to drive the auto-generated API reference page.
///         Replace this file with your real contracts when you fork this starter.
contract ExampleVault {
    /// @notice The underlying asset (e.g. USDC) the vault accepts.
    address public asset;

    /// @notice Total assets held by the vault, in base units of `asset`.
    uint256 public totalAssets;

    /// @notice Emitted on every successful deposit.
    /// @param sender   The address that submitted the deposit transaction.
    /// @param receiver The address credited with vault shares.
    /// @param assets   Amount of `asset` deposited.
    /// @param shares   Vault shares minted to `receiver`.
    event Deposit(address indexed sender, address indexed receiver, uint256 assets, uint256 shares);

    /// @notice Deposit `assets` of the underlying token in exchange for vault shares.
    /// @dev    Caller must have approved the vault to spend `assets` of `asset`.
    /// @param  assets   Amount to deposit, in base units.
    /// @param  receiver Address that will be credited with shares.
    /// @return shares   Number of shares minted to `receiver`.
    function deposit(uint256 assets, address receiver) external returns (uint256 shares) {
        // Stub — replace with real logic.
        shares = assets;
        totalAssets += assets;
        emit Deposit(msg.sender, receiver, assets, shares);
    }

    /// @notice Vault share balance of `account`.
    /// @param  account The address whose balance to read.
    /// @return shares  Number of vault shares held by `account`.
    function balanceOf(address account) external view returns (uint256 shares) {}

    /// @notice Convert a shares amount to the underlying assets it represents.
    /// @param  shares Amount of vault shares.
    /// @return assets Equivalent amount of underlying asset.
    function convertToAssets(uint256 shares) external view returns (uint256 assets) {}
}
