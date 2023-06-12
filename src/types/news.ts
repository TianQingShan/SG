/** 定义页面类型枚举值 */
export const enum PageType {
  /** 游戏指南 */
  GameGuide = 'game-guide',

  /** 教育课程 */
  EducationCourses = 'education-courses'
}

export type PageTypeValue = `${ PageType }`

export type Cid = ValueOf<typeof CID_TABLE>

export const CID_TABLE = {
  [PageType.GameGuide]: 18,
  [PageType.EducationCourses]: 21
} as const
