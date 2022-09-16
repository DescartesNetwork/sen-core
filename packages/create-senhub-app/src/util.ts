import fs from 'fs-extra'
import rimraf from 'rimraf'
import git from 'isomorphic-git'
import http from 'isomorphic-git/http/node'

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const rmrf = (file: string) => {
  return new Promise((resolve, reject) => {
    try {
      return rimraf(file, {}, resolve)
    } catch (er: any) {
      return reject(er.message)
    }
  })
}

export const clone = async ({ url, dir }: { url: string; dir: string }) =>
  await git.clone({
    fs,
    http,
    dir,
    url,
    ref: 'master',
    depth: 1,
  })
