export type BuildMode = 'production' | 'development'

export interface IBuildEnv {
    mode: BuildMode
    port: number
}