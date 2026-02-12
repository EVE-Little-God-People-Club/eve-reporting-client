import { decodeBase64 } from '@std/encoding'
import * as path from '@std/path'
import { Octokit } from 'octokit'


const githubToken = Deno.env.get("GITHUB_TOKEN")
const [repoOwner, repoName] = Deno.env.get("GITHUB_REPOSITORY")?.split('/') as [string, string]

const octokit = new Octokit({
  auth: githubToken
})

const tauriConfig = JSON.parse(await Deno.readTextFile(path.join(Deno.cwd(), 'src-tauri/tauri.conf.json')))

const version = tauriConfig.version as string
const releaseTag = `v${version}`

async function checkRelease() {
  const allReleases = await octokit.repos.listReleases({
    owner: repoOwner,
    repo: repoName
  })
  return allReleases.data.some(release => release.tag_name === releaseTag)
}

async function prepareKeystore() {
  const ENV_PROP_CONTENT = `
    EVE_LGPC_ANDROID_KEYSTORE_ALIAS = {{EVE_LGPC_ANDROID_KEYSTORE_ALIAS}}
    EVE_LGPC_ANDROID_KEYSTORE_TOKEN = {{EVE_LGPC_ANDROID_KEYSTORE_TOKEN}}
    EVE_LGPC_ANDROID_KEYSTORE_PATH = {{EVE_LGPC_ANDROID_KEYSTORE_PATH}}
  `.trim()
  const alias = Deno.env.get("ANDROID_KEYSTORE_ALIAS")
  const keystoreBase64 = Deno.env.get("ANDROID_KEYSTORE_CONTENT")
  const token = Deno.env.get("ANDROID_KEYSTORE_TOKEN")
  if (!alias || !keystoreBase64 || !token) {
    throw new Error("WTF! THERE IS NO ANY ENV!")
  }
  const keystore = decodeBase64(keystoreBase64)
  const keystorePath = path.join(Deno.cwd(), ".keystore")
  await Deno.writeFile(keystorePath, keystore)
  const envPropPath = path.join(Deno.cwd(), "src-tauri/gen/android/app/.env.properties")
  await Deno.writeTextFile(
    envPropPath,
    ENV_PROP_CONTENT
      .replace("{{EVE_LGPC_ANDROID_KEYSTORE_ALIAS}}", alias)
      .replace("{{EVE_LGPC_ANDROID_KEYSTORE_TOKEN}}", token)
      .replace("{{EVE_LGPC_ANDROID_KEYSTORE_PATH}}", keystorePath)
  )
}

async function init() {
  const script = `
    set -e
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    . "$HOME/.cargo/env"
    sudo apt-get update
    sudo apt-get install -y nodejs npm openjdk-17-jdk
    npm install
    npm run init-android
    npm run build
  `.trim()

  const cmd = new Deno.Command("/bin/sh", {
    args: ["-c", script],
    stdout: "piped",
    stderr: "piped"
  })

  const child = cmd.spawn()
  child.stdout.pipeTo(Deno.stdout.writable)
  child.stderr.pipeTo(Deno.stderr.writable)
  const status = await child.status
  if (!status.success) {
    Deno.exit(status.code)
  }
}

async function publishRelease() {
  const res = await octokit.repos.createRelease({
    owner: repoOwner,
    repo: repoName,
    tag_name: releaseTag
  })

  return res.data.id
}

async function publishAsset(releaseId: number) {
  const apkPath = path.join(Deno.cwd(), "src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release.apk")
  const apkData = await Deno.readFile(apkPath)
  await octokit.repos.uploadReleaseAsset({
    owner: repoOwner,
    repo: repoName,
    release_id: releaseId,
    name: `android-${version}-app.apk`,
    data: apkData as unknown as string
  })
}

async function main() {
  if (await checkRelease()) {
    console.log("release is already updated")
    return
  }
  await prepareKeystore()
  await init()
  const releaseId = await publishRelease()
  await publishAsset(releaseId)
}


await main()

