<script setup lang="ts">
import Title from './Title.vue'

let readMapActivedIndex = $ref(1)
let readMapItems = $ref([
  {
    title: 'Q3 - Q4 2022',
    list: [
      'SG team established',
      'OilWar 200 closed beta',
      'Wolfox public launch',
      'Community competitions'
    ]
  },
  {
    title: 'Q1 - Q2 2023',
    list: [
      'OilWar and Compass release',
      'Wolfox sold out',
      'SG brand exposure'
    ]
  },
  {
    title: 'Q2 - Q3 2023',
    list: [
      'Hiplay release',
      'OT listed on Polygon/Binance/Wemix',
      'SG ecosystem surpasses 100K players'
    ]
  },
  {
    title: 'Q3 - Q4 2023',
    list: [
      'OilWar metaverse',
      'Hiplay surpasses 50K content creators'
    ]
  }
])
</script>

<template>
  <div class="ReadMap">
    <div class="container">
      <Title title="Road Map" />
      <div class="content">
        <div class="items">
          <div
            class="item"
            :class="{ active: index === readMapActivedIndex }"
            v-for="(item, index) of readMapItems"
            @mouseenter="readMapActivedIndex = index">
            <div class="title">{{ item.title }}</div>
            <div class="list-items">
              <div class="list-item" v-for="listItem of item.list">
                {{ listItem }}
              </div>
            </div>
          </div>
        </div>
        <div class="after-line"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.ReadMap {
  padding: 0 3vw;
  @media (max-width: 992px) {
    padding: 0 20px;
  }

  .container {
    width: 100%;
    max-width: var(--container-width);
    margin: 0 auto;
    padding-bottom: 164px;
    @media (max-width: 992px) {
      padding-bottom: 132px;
    }

    .content {
      /** 项激活时的宽度 */
      --item-active-width: 475px;

      /** 项激活时的高度 */
      --item-active-height: 370px;

      @media (max-width: 1600px) {
        --item-active-width: 400px;
        --item-active-height: 370px;
      }

      @media (max-width: 992px) {
        --item-active-width: 100%;
        --item-active-height: 200px;
      }

      height: var(--item-active-height);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      margin-top: 80px;
      @media (max-width: 992px) {
        margin-top: 132px;
        height: auto;
      }

      .items {
        padding: 0 38px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        @media (max-width: 992px) {
          flex-direction: column;
          padding: 0;
        }

        .item {
          width: 240px;
          height: 72px;
          overflow: hidden;
          cursor: pointer;
          position: relative;
          border-radius: 16px;
          border: 1px solid #000;
          padding: 15px;
          background-color: #fff;
          box-shadow: 3px 3px 0 0 #000;
          transition: all .25s;
          @media (max-width: 992px) {
            width: auto;
            height: 48px;
          }

          &:not(:last-of-type) {
            margin-right: 76px;

            @media (max-width: 1600px) {
              margin-right: 20px;
            }

            @media (max-width: 992px) {
              padding: 10px 26px;
              margin: 0;
              margin-bottom: 42px;
            }
          }

          &::before {
            content: "";
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background-image: url('./images/read-map-item-bg.png');
            background-repeat: no-repeat;
            background-size: auto;
            background-position: right top;
            display: none;
            @media (max-width: 992px) {
              background-size: 109px auto;
            }
          }

          .title {
            font-size: 32px;
            line-height: 40px;
            font-weight: 600;
            color: #222222;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            @media (max-width: 992px) {
              font-size: 20px;
              line-height: 26px;
            }
          }

          .list-items {
            width: var(--item-active-width);
            display: none;
            margin-top: 32px;
            @media (max-width: 1600px) {
              width: 100%;
            }

            @media (max-width: 992px) {
              margin-top: 16px;
            }

            .list-item {
              font-size: 20px;
              font-weight: 400;
              line-height: 40px;
              color: #535353;
              @media (max-width: 992px) {
                font-size: 16px;
                line-height: 20px;
              }

              &:not(:last-of-type) {
                margin-bottom: 4px;
                @media (max-width: 992px) {
                  margin-bottom: 8px;
                }
              }

              &::before {
                content: ">";
                display: inline-block;
                margin-right: 10px;
              }
            }
          }

          &:not(.active):hover {
            transform: scale(1.05);
          }

          &.active {
            width: var(--item-active-width);
            height: var(--item-active-height);
            padding: 62px 40px;
            @media (max-width: 992px) {
              padding: 20px;
              width: 100%;
            }

            &::before {
              display: block;
            }

            .title {
              font-weight: 700;
            }

            .list-items {
              display: block;
            }
          }
        }
      }

      .after-line {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 100%;
        height: 1px;
        background-color: #222;
        z-index: -1;
        @media (max-width: 992px) {
          width: 1px;
          height: calc(100% + 84px);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        &::before,
        &::after {
          content: "";
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: var(--theme-color);
          @media (max-width: 992px) {
            width: 10px;
            height: 10px;
            top: auto;
          }
        }

        &::before {
          left: 0;
          @media (max-width: 992px) {
            bottom: 100%;
            left: 50%;
            transform: translate(-50%, 0);
          }
        }

        &::after {
          right: 0;
          @media (max-width: 992px) {
            top: 100%;
            right: 50%;
            transform: translate(50%, 0);
          }
        }
      }
    }
  }
}
</style>
