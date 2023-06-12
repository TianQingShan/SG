<script setup lang="ts">
import NotData from '#/components/not-data/index.vue'
import formatDate from '#/utils/format-date'
import { PageType, CID_TABLE } from '#/types/news'
import {
  getNewsList as _getNewsList,
  getTagsList as _getTagsList,
  type Response1,
  type Response2
} from '#/request/api/news'
import { onMounted, onUnmounted, watch, toRaw, nextTick } from 'vue'
import useRequestCancelMap from '#/utils/use-request-cancel-map'
import { NEWS_LIST_CANCEL, NEWS_TAGS_CANCEL } from '#/keys/request-cancel-map'
import bg1 from './images/bg1.png'
import bg2 from './images/bg2.png'
import bg3 from './images/bg3.png'
import bg4 from './images/bg4.png'
import BScroll from '@better-scroll/core'
import isMobile from '#/utils/is-mobile'
import { navigate } from 'vite-plugin-ssr/client/router'

type PageTypeValue = `${ PageType }`

type Props = {
  /** 页面类型 */
  pageType: PageTypeValue;
}

type TagItem = Response2['list'][number]
type NewsItem = Response1['list'][number]

let { pageType } = defineProps<Props>()

let { defineCancelMaps, saveCancelFn, cancelRequest, cancelRequests } = useRequestCancelMap()

defineCancelMaps([NEWS_LIST_CANCEL, NEWS_TAGS_CANCEL])

/** 根据类型获取信息 */
let info = $computed(() => {
  const NOT_MOBILE_SHOW = !isMobile()

  const BG_IMAGE_TABLE: Record<PageTypeValue, string> = {
    [PageType.GameGuide]: NOT_MOBILE_SHOW ? bg1 : bg2,
    [PageType.EducationCourses]: NOT_MOBILE_SHOW ?  bg3 : bg4
  }

  const TITLE_TABLE = $ref<Record<PageTypeValue, string>>({
    [PageType.GameGuide]: 'Game Guide',
    [PageType.EducationCourses]: 'Education Courses'
  })

  return { title: TITLE_TABLE[pageType], bgImage: BG_IMAGE_TABLE[pageType] }
})

let mobileTagsContainerHeightExpand = $ref(false)

/** 标签列表 */
let tags = $ref<TagItem[]>([])

/**
 * 获取标签名称
 * @param id 标签项对应的id
 */
 let getTagName = $computed(() => (id: number) => tags.find(item => item.id === id)?.name)

let tagsLoading = $ref(false)

/** 标签列表是否有数据 */
let isHasTags = $computed(() => tags.length)

/** 已选择的标签项 */
let selectedTagItems = $ref<TagItem[]>([])

/** 已选择的标签项对应的唯一key */
let selectedTagItemsKeys = $computed(() => selectedTagItems.map(item => item.id))

/** 获取当前标签项是否已选中 */
let tagItemIsSelected = $computed(() => (item: TagItem) => selectedTagItemsKeys.includes(item.id))

/** 是否有选中标签项 */
let hasSelectedTags = $computed(() => selectedTagItemsKeys.length)

/** 获取选中标签展示文本 */
let getSelectedTagsText = $computed(() => selectedTagItems.map(item => `# ${ item.name }`).join(' , '))

/** 点击标签 */
function handleTagClick(item: TagItem) {
  switch (tagItemIsSelected(item)) {
    case true:
      selectedTagItems = selectedTagItems.filter(selectedTagItem => selectedTagItem !== item)
    break
    case false:
      selectedTagItems.push(item)
    break
  }
}

let tagsRef = $ref<HTMLElement | null>(null)
let displayTagsExpandIcon = $ref(false)

watch(() => selectedTagItemsKeys, () => {
  cancelRequest(NEWS_LIST_CANCEL)
  newsList = []
  pagination.page = 1
  getNewsList()
})

/** 请求标签数据 */
async function getTagsList() {
  try {
    tagsLoading = true
    let { cancel, request } = _getTagsList({ cid: CID_TABLE[pageType] })
    saveCancelFn(NEWS_TAGS_CANCEL, cancel)

    let { list } = await request()
    tags = list
    tagsLoading = false

    await nextTick()
    let tagsContainerHeight = tagsRef!.clientHeight

    if (tagsContainerHeight > 100) displayTagsExpandIcon = true
  } catch (error) {}
}

/** 新闻列表 */
let newsList = $ref<NewsItem[]>([])

let renderNewsList = $computed(() => newsList.slice(0, pagination.page * pagination.limit))

/** 新闻列表是否有数据 */
let isHasNewsList = $computed(() => newsList.length)

let pagination = $ref({
  page: 1,
  limit: 20,
  total: 0
})

let newsListLoading = $ref(false)
let scrollLoading = $ref(false)
let tagsScrollBoxRef = $ref<HTMLElement[]>([])

watch(tagsScrollBoxRef, async () => {
  tagsScrollBoxRef.forEach(el => {
      new BScroll(el, {
        scrollX: true,
        scrollY: false
      })
    })
})

/**
 * 请求列表数据
 * @param displayLoading 是否显示加载中状态
 * - (true) 显示
 * - (false) 不显示
 */
async function getNewsList(displayLoading = true) {

  /** 处理发送数据 */
  let sendData = {
    cid: CID_TABLE[pageType],
    flgs: selectedTagItemsKeys.join(','),
    ...toRaw(pagination)
  }

  try {
    displayLoading && (newsListLoading = true)
    scrollLoading = true
    let { cancel, request } = _getNewsList(sendData)
    saveCancelFn(NEWS_LIST_CANCEL, cancel)
    let { list, count } = await request()

    newsList = [...newsList, ...list]
    pagination.total = count
    newsListLoading = false
  } catch (error) {

  } finally {
    scrollLoading = false
  }
}

/** 跳转到详情页 */
async function jumpToDetail(item: NewsItem) {
  let id = item.id

  switch (pageType) {
    case PageType.GameGuide:
      await navigate(import.meta.env.VITE_GAME_GUIDE_DETAILS_URL.replace('@id', id))
    break
    case PageType.EducationCourses:
      await navigate(import.meta.env.VITE_EDUCATION_COURSES_DETAILS_URL.replace('@id', id))
    break
  }
}

let listItemRef = $ref<HTMLElement | null>(null)

/** 滚动加载函数 */
async function scrollLoadFn(e: Event) {
  // if (pagination.total === newsList.length) return
  if (scrollLoading) return
  if (!listItemRef) return

  let viewPortHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  let elementHeight = listItemRef.clientHeight

  if (!elementHeight) return
  let offsetTop = listItemRef.offsetTop
  let scrollTop = document.documentElement.scrollTop

  if (elementHeight - (scrollTop - offsetTop) - viewPortHeight <= 0) {
    cancelRequest(NEWS_LIST_CANCEL)
    pagination.page++
    getNewsList(false)
  }
}

onMounted(() => {
  getNewsList()
  getTagsList()
  window.addEventListener('scroll', scrollLoadFn)
})

onUnmounted(() => {
  cancelRequests()
  window.removeEventListener('scroll', scrollLoadFn)
})
</script>

<template>
  <div class="News" :style="{ backgroundImage: `url('${ info.bgImage }')`, paddingBottom: renderNewsList.length? 'calc(3vw + 60px)' : '3vw' }">
    <div class="container">
      <div class="big-title">{{ info.title }}</div>
      <div class="content">
        <div class="left">
          <div class="filter-tag" v-show="hasSelectedTags">{{ getSelectedTagsText }}</div>
          <template v-if="newsListLoading">
            <div style="height: 50px; display: flex; align-items: center;">Loading...</div>
          </template>
          <template v-else>
            <div class="list-items" :class="{ 'not-has-selected-tags': !hasSelectedTags && isHasNewsList }" ref="listItemRef">
              <div class="list-item" v-for="item of renderNewsList" @click="jumpToDetail(item)">
                <div class="news-content">
                  <div class="picture" :style="{ backgroundImage: `url(${ item.author.head_img })` }"></div>
                  <div class="text-container">
                    <div class="top">
                      <div class="name">{{ item.author.name }}</div>
                      <div class="date">{{ formatDate(+item.add_time) }}</div>
                    </div>
                    <div class="bottom">
                      <div class="title">{{ item.title }}</div>
                      <div class="description" v-html="item.content.content"></div>
                      <div class="tags-container" @click.stop v-if="item.flgs">
                        <div class="tags-scroll-box" ref="tagsScrollBoxRef">
                          <div class="tags">
                            <template  v-for="id of item.flgs.split(',')">
                              <div class="tag" v-if="getTagName(+id)">
                                {{ getTagName(+id) }}
                              </div>
                            </template>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="news-image" :style="{ backgroundImage: `url(${ item.image_input[0] })` }"></div>
              </div>
            </div>
            <NotData v-if="!isHasNewsList" />
          </template>
        </div>
        <div class="right">
          <div class="title">
            <div class="text">Topics</div>
            <div class="clear-container">
              <div class="clear" :class="{ 'has-selected-tags': hasSelectedTags }" @click="selectedTagItems = []">
                Clear
              </div>
              <div
                class="arrow"
                :class="{ 'expand': mobileTagsContainerHeightExpand }"
                @click="mobileTagsContainerHeightExpand = !mobileTagsContainerHeightExpand"
                v-if="displayTagsExpandIcon">
                <img src="./images/clear-expand-arrow.png" />
              </div>
            </div>
          </div>
          <div class="tags-container">
            <div class="tags-box">
              <div class="tags" ref="tagsRef" :class="{ 'expand': mobileTagsContainerHeightExpand }">
                <div
                  class="tag"
                  :class="{ selected: tagItemIsSelected(item) }"
                  v-for="item of tags"
                  @click="handleTagClick(item)">
                  {{ item.name }}
                </div>
              </div>
            </div>
            <div class="not-tags" v-if="!isHasTags">No tags available~</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.News {
  position: relative;
  background-repeat: no-repeat;
  background-position: center top;
  background-size: 100% auto;
  border-radius: 60px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  padding: 3vw 3vw 0;
  height: 100%;
  @media (max-width: 992px) {
    padding: 20px;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -1;
    background-image: url('./images/bg5.png');
    background-repeat: no-repeat;
    background-position: center bottom;
    background-size: 100% auto;
    display: none;

    @media (max-width: 414px) {
      display: block;
    }
  }

  .container {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: var(--container-width);
    margin: 0 auto;
    padding-top: 60px;
    @media (max-width: 992px) {
      padding-top: 35px;
    }

    .big-title {
      font-size: 72px;
      line-height: 90px;
      font-weight: 600;
      color: #222;
      text-align: center;

      @media (max-width: 992px) {
        font-size: 28px;
        line-height: 35px;
        font-weight: 700;
      }
    }

    .content {
      display: flex;
      margin-top: 100px;
      @media (max-width: 992px) {
        margin-top: 62px;
        flex-direction: column-reverse;
      }

      .left {
        border-right: 1px solid #f2f2f5;
        padding-right: 40px;
        margin-right: 40px;
        overflow: hidden;
        flex-grow: 1;
        @media (max-width: 992px) {
          border-right: none;
          padding-right: 0;
          margin-right: 0;
        }

        .filter-tag {
          font-size: 26px;
          line-height: 32px;
          font-weight: 600;
          color: #222;
          padding-bottom: 40px;
          margin-bottom: 40px;
          border-bottom: 1px solid #f2f2f5;
          @media (max-width: 992px) {
            padding-top: 40px;
            padding-bottom: 24px;
            margin-bottom: 30px;
            font-size: 20px;
            line-height: 25px;
          }
        }

        .list-items {
          @media (max-width: 992px) {
            &.not-has-selected-tags {
              margin-top: 30px;
            }
          }

          .list-item {
            cursor: pointer;
            display: flex;
            transition: all .25s;

            &:hover {
              opacity: .75;
            }

            &:not(:last-of-type) {
              border-bottom: 2px solid #f2f2f5;
              padding-bottom: 40px;
              margin-bottom: 40px;
              @media (max-width: 992px) {
                padding-bottom: 24px;
                margin-bottom: 24px;
              }
            }

            .news-content {
              flex-grow: 1;
              display: flex;
              overflow: hidden;

              .picture {
                flex-shrink: 0;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background-color: #efefef;
                background-size: cover;
                background-repeat: no-repeat;
                background-position: center;
                margin-right: 20px;
                @media (max-width: 992px) {
                  width: 24px;
                  height: 24px;
                  margin-right: 12px;
                }
              }

              .text-container {
                flex-grow: 1;
                overflow: hidden;

                .top {
                  display: flex;
                  align-items: center;
                  margin-bottom: 26px;
                  @media (max-width: 992px) {
                    margin-bottom: 15px;
                  }

                  .name {
                    font-size: 16px;
                    font-weight: 700;
                    line-height: 20px;
                    color: #222;
                    margin-right: 15px;
                    @media (max-width: 992px) {
                      font-size: 14px;
                      line-height: 18px;
                    }
                  }

                  .date {
                    font-size: 14px;
                    font-weight: 300;
                    line-height: 18px;
                    color: #858687;
                    display: flex;
                    align-items: center;
                    @media (max-width: 992px) {
                      font-size: 12px;
                      line-height: 15px;
                    }

                    &::before {
                      content: "";
                      width: 4px;
                      height: 4px;
                      border-radius: 50%;
                      background-color: #858687;
                      margin-right: 8px;
                    }
                  }
                }

                .bottom {
                  .title {
                    font-size: 22px;
                    font-weight: bold;
                    line-height: 28px;
                    color: #222;
                    margin-bottom: 8px;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    overflow: hidden;
                    @media (max-width: 992px) {
                      font-size: 16px;
                      line-height: 20px;
                      margin-bottom: 4px;
                    }
                  }

                  :deep(.description) {
                    font-size: 16px;
                    font-weight: 300;
                    line-height: 28px;
                    color: #858687;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 3;
                    overflow: hidden;
                    @media (max-width: 992px) {
                      font-size: 12px;
                      line-height: 18px;
                      -webkit-line-clamp: 2;
                    }

                    * {
                      color: inherit !important;
                      display: contents;
                      font-size: inherit !important;
                      font-family: 'Lexend' !important;
                      font-weight: inherit !important;
                      pointer-events: none;
                    }
                  }

                  .tags-container {
                    position: relative;
                    margin-top: 20px;

                    &::before {
                      content: "";
                      position: absolute;
                      top: 0;
                      bottom: 0;
                      right: 0;
                      width: 60px;
                      background-image: linear-gradient(90deg, transparent, #fff);
                      pointer-events: none;
                      z-index: 1;
                    }

                    .tags-scroll-box {
                      width: 100%;
                      overflow: hidden;

                      .tags {
                        width: max-content;
                        display: flex;
                        margin: 0 -8px;

                        .tag {
                          margin: 0 8px;
                          font-size: 14px;
                          font-weight: 300;
                          line-height: 24px;
                          color: #222;
                          padding: 4px 12px;
                          border-radius: 12px;
                          background-color: #f2f2f2;
                        }
                      }
                    }
                  }
                }
              }
            }

            .news-image {
              flex-shrink: 0;
              width: 320px;
              height: 228px;
              border-radius: 12px;
              background-color: #efefef;
              background-repeat: no-repeat;
              background-position: center;
              background-size: cover;
              margin-left: 80px;

              @media (max-width: 992px) {
                width: 80px;
                height: 56px;
                margin-left: 12px;
              }
            }
          }
        }
      }

      .right {
        height: 100%;
        position: sticky;
        top: 20px;
        flex-shrink: 0;
        width: 328px;
        @media (max-width: 992px) {
          width: 100%;
          height: auto;
          position: initial;
        }

        .title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          @media (max-width: 992px) {
            margin-bottom: 19px;
          }

          .text {
            font-size: 22px;
            font-weight: 500;
            line-height: 28px;
            color: #222;
            @media (max-width: 992px) {
              font-size: 14px;
              line-height: 18px;
            }
          }

          .clear-container {
            display: flex;
            align-items: center;

            .clear {
              cursor: pointer;
              user-select: none;
              font-size: 14px;
              line-height: 19px;
              font-weight: 500;
              color: #9c9c9c;
              position: relative;
              display: flex;
              align-items: center;
              transition: all .25s;
              @media (max-width: 992px) {
                font-size: 12px;
                font-weight: 300;
                line-height: 16px;
                border-radius: 20px;
                border: 1px solid #f2f2f5;
                padding: 4px 8px;
              }

              &::after {
                content: "";
                margin-left: 6px;
                width: 13px;
                height: 16px;
                background-image: url('./images/clear-icon-default.png');
                background-position: center;
                background-repeat: no-repeat;
                background-size: contain;
              }

              &.has-selected-tags {
                color: var(--theme-color);

                &::after {
                  background-image: url('./images/clear-icon-active.png')
                }

                &:hover {
                  opacity: .75;
                }
              }
            }

            .arrow {
              cursor: pointer;
              margin-left: 12px;
              display: none;
              @media (max-width: 992px) {
                display: block;
              }

              &.expand {
                transform: rotate(180deg);
              }
            }
          }
        }

        .tags-container {
          .tags-box {
            overflow: hidden;

            @media (max-width: 992px) {
              max-height: 100px;

              &.expand {
                max-height: none;
              }
            }

            .tags {
              display: flex;
              flex-wrap: wrap;
              margin: -8px;
              overflow: hidden;

              .tag {
                cursor: pointer;
                user-select: none;
                margin: 8px;
                font-size: 14px;
                font-weight: 300;
                line-height: 24px;
                color: #222;
                padding: 4px 12px;
                border-radius: 12px;
                background-color: #f2f2f2;
                border: 1px solid transparent;
                transition: all .25s;

                &.selected {
                  border-color: var(--theme-color);
                  background-color: rgba(8, 193, 177, .08);
                  color: var(--theme-color);
                }

                &:hover {
                  opacity: .75;
                }
              }
            }
          }

          .not-tags {
            font-size: 14px;
            font-weight: 200;
            color: #858687;
            margin-top: 15px;
            background-color: #f2f2f2;
            padding: 15px;
            border-radius: 12px;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
