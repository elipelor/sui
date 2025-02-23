// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { isBasePayload } from '_payloads';

import type { SignatureScheme, SuiAddress } from '@mysten/sui.js';
import type { BasePayload, Payload } from '_payloads';
import type { AccountSerialized } from '_src/background/keyring/Account';

type MethodToPayloads = {
    create: {
        args: { password: string; importedEntropy?: string };
        return: void;
    };
    getEntropy: {
        args: string | undefined;
        return: string;
    };
    unlock: {
        args: { password: string };
        return: void;
    };
    walletStatusUpdate: {
        args: void;
        return: {
            isLocked: boolean;
            isInitialized: boolean;
            accounts: AccountSerialized[];
            activeAddress: string | null;
        };
    };
    lock: {
        args: void;
        return: void;
    };
    clear: {
        args: void;
        return: void;
    };
    appStatusUpdate: {
        args: { active: boolean };
        return: void;
    };
    setLockTimeout: {
        args: { timeout: number };
        return: void;
    };
    signData: {
        args: { data: string; address: SuiAddress };
        return: {
            signatureScheme: SignatureScheme;
            signature: string;
            pubKey: string;
        };
    };
};

export interface KeyringPayload<Method extends keyof MethodToPayloads>
    extends BasePayload {
    type: 'keyring';
    method: Method;
    args?: MethodToPayloads[Method]['args'];
    return?: MethodToPayloads[Method]['return'];
}

export function isKeyringPayload<Method extends keyof MethodToPayloads>(
    payload: Payload,
    method: Method
): payload is KeyringPayload<Method> {
    return (
        isBasePayload(payload) &&
        payload.type === 'keyring' &&
        'method' in payload &&
        payload['method'] === method
    );
}
