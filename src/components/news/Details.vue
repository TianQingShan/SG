<script setup lang="ts">
import { usePageContext } from '#renderer/usePageContext'
import { PageType, CID_TABLE } from '#/types/news'
import {
  getTagsList as _getTagsList,
  getDetail as _getDetail,
  type Response2,
  type Response3
} from '#/request/api/news'
import { onMounted, onUnmounted, watch, nextTick } from 'vue'
import formatDate from '#/utils/format-date'
import { NEWS_DETAILS, NEWS_TAGS_CANCEL } from '#/keys/request-cancel-map'
import useRequestCancelMap from '#/utils/use-request-cancel-map'
import NotData from '#/components/not-data/index.vue'
import BScroll from '@better-scroll/core'
import { navigate } from 'vite-plugin-ssr/client/router'

type PageTypeValue = `${ PageType }`

type TagItem = Response2['list'][number]

type Props = {
  /** 页面类型 */
  pageType: PageTypeValue;
}

let { defineCancelMaps, saveCancelFn, cancelRequests } = useRequestCancelMap()

defineCancelMaps([NEWS_DETAILS, NEWS_TAGS_CANCEL])

let { pageType } = defineProps<Props>()
let pageContext = usePageContext()

/** 标签列表 */
let tags = $ref<TagItem[]>([])

/**
 * 获取标签名称
 * @param id 标签项对应的id
 */
let getTagName = $computed(() => (id: number) => tags.find(item => item.id === id)?.name)

/** 获取标签名称 */

/** 请求标签数据 */
async function getTagsList() {
  try {
    let { cancel, request } = _getTagsList({ cid: CID_TABLE[pageType] })
    saveCancelFn(NEWS_TAGS_CANCEL, cancel)

    let { list } = await request()
    tags = list
  } catch (error) {}
}

/** 获取回退文案 */
let getBackText = $computed(() => {
  const TABLE = {
    [PageType.GameGuide]: 'All Game Guide',
    [PageType.EducationCourses]: 'All Education Courses',
  }

  return TABLE[pageType]
})

/** 回退 */
async function back() {
  switch (pageType) {
    case PageType.GameGuide:
      await navigate(import.meta.env.VITE_GAME_GUIDE_URL)
    break
    case PageType.EducationCourses:
      await navigate(import.meta.env.VITE_EDUCATION_COURSES_URL)
    break
  }
}

let detailData = $ref<Response3 | null>(null)

let tagsScrollBoxRef = $ref<HTMLElement[]>([])

watch(tagsScrollBoxRef, async () => {
  tagsScrollBoxRef.forEach(el => {
      new BScroll(el, {
        scrollX: true,
        scrollY: false
      })
    })
})

/** 获取详情 */
let contentRef = $ref<HTMLElement | null>(null)
async function getDetail() {
  try {
    let { cancel, request } = _getDetail({ id: pageContext.routeParams.id as string })
    saveCancelFn(NEWS_DETAILS, cancel)
    let response = await request()

    detailData = response

    await nextTick()

    if (contentRef) {
      let getShareTags = contentRef.querySelectorAll('a[class="link"]')

      getShareTags.forEach(el => el.parentElement?.classList.add('link-parent'))
    }
  } catch (error) {}
}


// watch(() => route.params.id, () => {
//   getDetail()
// })

async function jumpPage(item: Response3['recommend'][number] ) {
  let { id } = item

  switch (pageType) {
    case PageType.GameGuide:
      await navigate(import.meta.env.VITE_GAME_GUIDE_DETAILS_URL.replace('@id', id))
    break
    case PageType.EducationCourses:
      await navigate(import.meta.env.VITE_EDUCATION_COURSES_DETAILS_URL.replace('@id', id))
    break
  }
}

onMounted(() => {
  getTagsList()
  getDetail()
})

onUnmounted(() => {
  cancelRequests()
})
</script>

<template>
  <div class="NewsDetails" v-if="detailData">
    <div class="container">
      <div class="back" @click="back">{{ getBackText }}</div>
      <div class="top-content">
        <div class="user-info">
          <div class="picture" :style="{ backgroundImage: `url(${ detailData.info.author.head_img })` }"></div>
          <div class="text-container">
            <div class="top">
              <div class="name">{{ detailData.info.author.name }}</div>
              <div class="date">{{ formatDate(+detailData.info.add_time) }}</div>
            </div>
            <div class="bottom">{{ detailData.info.author.synopsis }}</div>
          </div>
        </div>
        <div class="details">
          <div class="title">{{ detailData.info.title }}</div>
          <div class="content">
            <template v-if="detailData.info.content.content">
              <div v-html="detailData.info.content.content" ref="contentRef"></div>
            </template>
            <template v-else>
              <NotData />
            </template>
          </div>
          <div class="tags-container" v-if="detailData.info.flgs">
            <div class="tags">
              <template v-for="id of detailData.info.flgs.split(',')">
                <div class="tag" v-if="getTagName(+id)">
                  {{ getTagName(+id) }}
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="related-list" v-if="detailData.recommend.length">
        <div class="items">
          <div class="item" v-for="item of detailData.recommend" @click="jumpPage(item)">
            <div class="left">
              <div class="date">{{ formatDate(+item.add_time) }}</div>
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
            <div class="right" :style="{ backgroundImage: `url(${ item.image_input[0] })` }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.NewsDetails {
  overflow: hidden;
  padding: 0 3vw;
  @media (max-width: 992px) {
    padding: 20px 20px 0;
  }

  .container {
    position: relative;
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    padding-top: 50px;
    @media (max-width: 992px) {
      padding-top: 0;
    }

    .back {
      cursor: pointer;
      font-size: 16px;
      line-height: 20px;
      font-weight: 400;
      color: #222;
      display: flex;
      align-items: center;

      &::before {
        content: "";
        width: 18px;
        height: 10px;
        background-image: url('./images/back-arrow.png');
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        margin-right: 12px;

        @media (max-width: 992px) {
          background-image: url('./images/back-arrow-mobile.png');
          margin-right: 16px;
          width: 8px;
          height: 16px;
        }
      }

      &:hover {
        text-decoration: underline;
        opacity: .75;
      }
    }

    .top-content {
      position: relative;
      margin-top: 80px;
      @media (max-width: 992px) {
        padding-top: 40px;
        margin-top: 20px;
      }

      &::before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: -1;
        background-image: url('./images/details-mobile-bg.png');
        background-repeat: no-repeat;
        background-position: center top;
        background-size: 100% auto;
        display: none;
        @media (max-width: 414px) {
          display: block;
          margin: 0 -20px;
        }
      }

      .user-info {
        position: relative;
        display: flex;
        margin-bottom: 60px;
        padding-bottom: 60px;
        border-bottom: 1px solid rgba(0, 0, 0, .04);
        @media (max-width: 992px) {
          border-bottom: none;
          margin-bottom: 40px;
          padding-bottom: 0;
        }

        .picture {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background-color: #efefef;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
          flex-shrink: 0;
          margin-right: 20px;
          @media (max-width: 992px) {
            width: 48px;
            height: 48px;
          }
        }

        .text-container {
          .top {
            display: flex;
            align-items: center;
            margin-bottom: 4px;

            .name {
              font-size: 16px;
              font-weight: 700;
              color: #222;
              margin-right: 15px;
            }

            .date {
              display: flex;
              align-items: center;
              font-size: 14px;
              font-weight: 300;
              line-height: 18px;
              color: #858687;

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
            font-size: 14px;
            font-weight: 300;
            color: #858687;
            line-height: 20px;
          }
        }
      }
      .details {
        padding-bottom: 80px;
        @media (max-width: 992px) {
          padding-bottom: 40px;
        }

        .title {
          font-size: 44px;
          font-weight: 700;
          color: #222;
          margin-bottom: 40px;
          line-height: 50px;
          @media (max-width: 992px) {
            font-size: 32px;
            line-height: 42px;
          }
        }

        :deep(.content) {
          word-break: break-word;

          p,
          p span {
            font-family: 'Lexend' !important;
            font-size: 20px !important;
            font-weight: 350;
            line-height: 40px;
            color: #444;
            @media (max-width: 768px) {
              font-size: 18px !important;
              line-height: 32px;
            }
          }

          h1,
          h2,
          h3,
          h4,
          h5,
          h6,
          h1 span,
          h2 span,
          h3 span,
          h4 span,
          h5 span,
          h6 span {
            color: #222;
            font-family: 'Lexend' !important;
            font-weight: 600;
            font-size: 32px;
            line-height: 40px;
            @media (max-width: 768px) {
              font-size: 24px;
              line-height: 30px;
            }
          }

          img {
            width: 100%;
          }

          a,
          a span {
            text-decoration: underline;
            transition: all .25s;
            color: inherit;

            &:hover {
              color: var(--theme-color) !important;
            }
          }

          .link-parent {
            // font-weight: 600 !important;
            // color: #222 !important;

            .link {
              position: relative;
              border-bottom: 1px solid transparent;
              transition: all 0s;

              &:hover {
                border-color: #444;
              }

              &,
              span {
                font-weight: 400 !important;
                color: #444 !important;
                text-decoration: none !important;
              }
            }
          }
        }

        .tags-container {
          margin-top: 80px;
          @media (max-width: 992px) {
            margin-top: 40px;
          }

          .tags {
            display: flex;
            flex-wrap: wrap;
            margin: -8px;

            .tag {
              margin: 8px;
              font-size: 14px;
              line-height: 24px;
              font-weight: 300;
              color: #222;
              border-radius: 12px;
              padding: 4px 12px;
              background-color: #f2f2f2;
            }
          }
        }
      }
    }

    .related-list {
      position: relative;
      padding: 40px 0;
      @media (max-width: 992px) {
        padding: 20px 0;
      }

      &::before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 100vw;
        background-color: #fafafa;
        z-index: -1;
      }

       .items {
        .item {
          cursor: pointer;
          background-color: #fff;
          border: 1px solid rgba(0, 0, 0, .04);
          border-radius: 12px;
          display: flex;
          padding: 30px;
          transition: all .25s;
          @media (max-width: 992px) {
            padding: 20px;
          }

          &:hover {
            opacity: .75;
          }

          &:not(:last-of-type) {
            margin-bottom: 40px;
            @media (max-width: 992px) {
              margin-bottom: 20px;
            }
          }

          .left {
            overflow: hidden;
            margin-right: 88px;
            flex-grow: 1;
            @media (max-width: 992px) {
              margin-right: 12px;
            }

            .date {
              font-size: 14px;
              font-weight: 300;
              line-height: 18px;
              color: #858687;
              margin-bottom: 20px;
              @media (max-width: 992px) {
                font-size: 12px;
                line-height: 15px;
                margin-bottom: 12px;
              }
            }

            .title {
              font-size: 22px;
              font-weight: 500;
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
              }
            }

            :deep(.description) {
              font-size: 16px;
              font-weight: 300;
              color: #858687;
              line-height: 28px;
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
              margin-top: 30px;

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
                    line-height: 24px;
                    font-weight: 300;
                    color: #222;
                    border-radius: 12px;
                    padding: 4px 12px;
                    background-color: #f2f2f2;
                    @media (max-width: 992px) {
                      font-size: 12px;
                    }
                  }
                }
              }
            }
          }

          .right {
            flex-shrink: 0;
            width: 320px;
            height: 228px;
            border-radius: 12px;
            background-color: #efefef;
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
            @media (max-width: 992px) {
              width: 80px;
              height: 56px;
              margin-top: 28px;
            }
          }
        }
      }
    }
  }
}
</style>
