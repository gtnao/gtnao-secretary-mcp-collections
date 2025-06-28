# TODO: Slack Message MCP サーバーの実装

- [x] Project setup - TypeScript, ESLint, Prettier, vitest configuration
- [x] Environment variable validation (TDD) - Required variables and channel ID format
- [x] Input schema definition (TDD) - zod validation for message/blocks
- [x] Slack API communication layer (TDD) - msw mocking and error handling
- [x] MCP tool implementation (TDD) - tools/list and tools/call handlers
- [x] Server startup process - MCP server initialization
- [x] Finishing touches - .env.example, README, final testing

Current: Complete!

# 🚨 ABSOLUTE EXECUTION RULES

## MANDATORY

1. **NEVER STOP until ALL tasks are complete** - No confirmations, reports, or consultations needed
2. **Create TODO list at the top of CLAUDE.md and update with ✓ as you progress**

## TODO Format (KEEP FLAT - NO NESTING)

'''markdown

# TODO: [Task Name]

- [ ] Specific task 1 description
- [ ] Specific task 2 description
- [ ] Specific task 3 description
- [x] Completed task

Current: [Currently executing task]
'''

## FORBIDDEN

- "Shall I continue?" "Is this okay?" or ANY confirmation
- "I've completed X" or ANY progress reports
- Waiting for user response
- Stopping on errors (find workarounds and continue)

## ONLY EXCEPTION

Fatal system errors only. Otherwise **RUN TO COMPLETION NO MATTER WHAT**.

---

**Follow these rules and execute the entire task without ANY hesitation.**

# Slack Message MCP サーバーの実装

## 概要

ClaudeCodeからSlackの指定チャンネルにメッセージを送信するためのMCPサーバーを実装してください。

## 厳守事項

1. **TDD（テスト駆動開発）**: t-wada氏のTDDアプローチに従い、必ずテストから書き始める
2. **Classの使用禁止**: TypeScriptのClassは一切使用しない（関数とオブジェクトで実装）
3. **現在のディレクトリで作業**: 新規ディレクトリを作成せず、このディレクトリで開発する
4. **最新のMCP仕様準拠**: 実装前に必ず最新のMCPドキュメントを確認する

## 使用ライブラリ

- MCP SDK: 最新のドキュメントを確認して必要なパッケージを特定
- zod: 入力バリデーション
- @slack/web-api: Slack API通信
- dotenv: 環境変数管理
- vitest: テストフレームワーク
- msw: Slack APIのモック（2025年のベストプラクティスを確認）
- ESLint/Prettier: コード品質管理

## 機能仕様

### 提供するツール: send_message

- プレーンテキストとBlock Kit形式の両方に対応
- 入力: message（文字列）またはblocks（配列）のいずれか必須
- 環境変数で指定されたチャンネルに投稿

### 環境変数

- SLACK_BOT_TOKEN: Bot User OAuth Token（必須）
- SLACK_CHANNEL_ID: 投稿先チャンネルID（必須、C=public/G=private）

## 実装タスク

1. プロジェクトセットアップ

   - TypeScript、ESLint（no-class rule）、Prettier、vitest設定
   - 必要パッケージのインストール（MCPパッケージは要調査）

2. 環境変数バリデーション（TDD）

   - 必須変数の存在確認テストと実装
   - チャンネルID形式（C/Gプレフィックス）の検証

3. 入力スキーマ定義（TDD）

   - zodでmessage/blocksの相互排他バリデーション
   - 型定義のエクスポート

4. Slack API通信層（TDD）

   - mswでSlack APIをモック
   - 正常系・エラー系（権限不足、チャンネル不存在）のテストと実装

5. MCPツール実装（TDD）

   - tools/list、tools/callハンドラーの実装
   - エラーレスポンスの適切な形式化

6. サーバー起動処理

   - MCPサーバーの初期化とStdioTransport接続

7. 仕上げ
   - .env.example、README作成
   - 全テスト確認とリファクタリング

## 注意事項

- 各機能は必ずRed-Green-Refactorサイクルで実装
- Slack App権限はchat:write.public（公開）またはgroups:write（プライベート）が必要
- エラーは詳細な情報を含めて返す
