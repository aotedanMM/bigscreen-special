
// 历史轨迹
const componentBase = (G as any).base.ComponentBase;
const component = componentBase.extend({
    options: {
        symbolConfig: null,
        popupManager: null,
        featureLocate: null,
        hisLayerId: 'hisLayerId',
        hisAlLayerId: 'hisAlLayerId',
        trackLayerId: 'trackLayerId',
        paramId: 'fireAnimationId',
        playStatus: false,
        // 播放完成的通知事件名
        finishEventName: 'finish',
        // 存储所有的图标符号
        symbolSet: {
            // 默认符号
            default: {
                source: 'data:image/png;base64,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',
                width: 80,
                height: 80,
                offsetX: 40,
                offsetY: 40,
                opacity: 1,
                size: 1,
            },
            startSymbol: {
                source: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAABPCAYAAAAgGwHHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpiYjY0NTNhMC03ZDk1LTJjNGItODViYS05YjNmNWU1ZTc1NzkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NkE5OEMxMkUwMDhBMTFFQUJFRkFFNTlBNDE5MjhDMTUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NkE5OEMxMkQwMDhBMTFFQUJFRkFFNTlBNDE5MjhDMTUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ZDcwNzU1ZTItZThlZS00ODdmLTg1MzItMGZmMzEyMDZmMTA3IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6YTg3OGQ0ODctZjY4OS1mYTQwLTg5YzAtNDVlZjg4MmMzMmZjIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+fRFr3AAAA9JJREFUeNrsnU1IVFEUx899M9hYSVamiREEkZvWrVq1qlXrICwwq13gol0ftKh1i1pIQlEt2qWBSYFRiAulDyIibSGIkx8lVoQ60/hO59z35s04jagbnfv8/+Dw7rtz752P373v3vdmeGMOP/ZOEFGnRCOBODEh0epBbmxRp50e5MZbsofPIN5AcMxJlss82nicbhzpoD3VOHq7wvf5Cbo6eJ76J3qX5BtZRXNp4b6TY5DrqORjXftXPkRDrpuU84Y5GIssAMEAggEEAwgGEAwgGIIBBAMIBhAMIBhAMIBgCAYQDCAYQDCAYADBAIIBBEMwgGAAwQCCAQQDCAYQDMEAggEEAwgGEAwgGEAwBAMIBhAMIBhUhmC9JR5wjx8Lk6sTfG3oQtnCoHKZnk/bm5GWUvZmpABzMIBgUCmCsaKKL5Mq+Jwm8FnEjrREq97Sv4fc/ueVeonPErvXWO+eRBvmYAfOECTa11jnq8QlLLLc4aHE2zWUvygxB8HuoOfyV1ZZtluiD6dJ7qH/J/NhFR3hOs6D3R3Fd1co80LiPQS7y5MV5taOzXauFDfBvyWeL/PYjMQzCHafrmXyn0r8hWD3eRnOx6X00CYkjoL1suuXkrxFiVcQHB8GSvb1IsgsBMeHoZL9ftqkJF1/A8NnPUNkJFiCNOjgHf9jYlvRCXKWBkfaEsngUeZgjjbcfH+RIbgSpZ5RqaTCklYqB2bztma6veH6U34u//4WRumdFKiKSti+oJ0jwYY5J7m55gd+LGV7DspNiZ5aSdaIr2qJlBiToCh+9krOov0KUZ1Oj930ZkRkypaNyus+VzNxjZSq1XYheOPlqtRdLGIiSRIyhFNMFAlk3c/QJ63jZ2gwkJsPslsTitat0fak3ZEWUwPBGyW3ReZZn+ui0cpFQvPy8tJ9SmXG6bXWy6apl630YHSbsD4Th50hCNtJmOpG9HkwB28ErJ+8jrRgqWTzTMk1jWAy1tzxWzTQdJnav902b7Qe69pKWrDbkrqmkPb5/0adRn8X7c4h+jTtlcVvU7BIYopshjrsWjoUWeQ7LM6RyqJ11pLOYdikDz2K1+/TTKFHVy5VnmfVBK+UGyR9QNIJ67fo9XNYiovGpwnzi8d8JLhQVa90jUrtqfA5KOv7ELxebPFMIC80Jq9ZTpHMPkk2SNb2gkwOJUcDNhrJ0QhfKv+PJKZE9rjs5sJRbB/IQPA6jmDjha4K1lht20Ow2SqJnZK1g4J0SjK3SAFPXCWMnjCRkbmVM1Jlgez3xeaXbGeljTkVap3apjnoGNJAluMh+J8AAwDv/lMl/MmzFAAAAABJRU5ErkJggg==',
                width: 120,
                height: 79,
                offsetX: 60,
                offsetY: 70,
                opacity: 1,
                size: 1,
            },
            endSymbol: {
                source: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHkAAABPCAYAAADP2Wr5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpiYjY0NTNhMC03ZDk1LTJjNGItODViYS05YjNmNWU1ZTc1NzkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTAzNDM2OEUwMDhBMTFFQUI5N0I5QTI1NDhERDNEOTAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTAzNDM2OEQwMDhBMTFFQUI5N0I5QTI1NDhERDNEOTAiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ZDcwNzU1ZTItZThlZS00ODdmLTg1MzItMGZmMzEyMDZmMTA3IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6YTg3OGQ0ODctZjY4OS1mYTQwLTg5YzAtNDVlZjg4MmMzMmZjIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+m08MgwAAA/hJREFUeNrsnctPE0Ecx2eg3fIyIA9jCXohJATj1RvEqwdv/gdg4kkTTyZg4oWjBy8eiJyMB28+EjRKNKFGDwY1EggRiUSUgqU8aoHCPn7+Zttut6UNcJHu9vsJPzrM7mzofnZ+M1OWVia6ui4JIUY5wgL4jShHv2TJSxDsb9FVEOx7wlU4B/4nULSyr0/UDA8L2daGM+QRKBYTqcFBYUxM7NumxmQqrGyIRCDYo6KTvb376oumawj2JqW8YUyuACAZkgEkA0gGkAwgGUAygGQAyZAMIBlAMoBkAMkAkgEkA0iGZADJAJIBJANIBpAMIBlAMiTjFEAygGQAyQCSASQDSAaQDCAZkgEkA0gGkAwgGUAygGRwWMnqPRqB96DV1cNLTg0NlWwAylTwyor9LrnFKPouuQBjMoBkUI6SozgNvmZZSR5QBZwLX/Kbo199BsWY8PYnypzimOFoOWK7BxxXMSZ7gz8cN4/YZo7jBiZe3uIhx+QR9r/GsQ3JHnstgOP2Ifd9xvEGSyhv8pLjyyEuhjtYJ3u7N98/YJ9XHJ8h2ds8PmCsHanEdZTfJCc4XpTYFud4Dsn+4GmJ+iccOiT7g9eZ8bmQMVGh+FGyeol2tqDO5HgLyf7ifcHP6oWSdUj2Fx8Lfn4nKpiA15/A+T09IAVpJEVQkqjmwbh6NBBcuFAlnX0WiGYu67r63FlTplO3zvvtTWmaAcllyrmdHc5AskFIqhMkA7ZONmyxacFf93T9+6OQLdB+fuOm+dUyzZCQsuA4KYMvkG0SMjldW2NBcpnQndxq5IdmliNtadwlbbeUnlKrqk9k0G5I+xYSooe7bexuajfO8jV7O5Ez9eYDaNyqjkst3Vtba7P19ZuQfMx0bW62ssNWkVkjSddjYV2CU3SblD1JoknTMrT9iyrprLQy7cJ8/OBcY+MqJB8TnfG4StFh7orpnGz3yHRnzgkkkU3J07oRuagFr0wZxripm5qjkrs8qSSg9pb2ETLHUk1luHNtbW2+udmC5GPANNV8SQRZRlXeyEo5seR0axIDG+sfRpoab13fSERMsidmTo/P+iZuILPjtJ3uyZI+TNfqvmvP/LIdS9EOHovPuoUWT9npWspLzjJTky25a5xj/Fxsb//lO8lE5X9v/YmaWvcwqu5H67SzkMsOuUZaV5d2JmXubuyk61y1wYV5bmbfuSq5wd+dFNL1/03VRqbf2ZdllM3FWM4ZLp9mMQ1pu9LVlTNTbpGz6FSRa+wmkeRvy1xetEVnrhQp/fVPJZ6QbFlW3myYy2oN/CMdagkkTnJdkyrzXrW8F6+e7LG7mtMyD+akDrDLsSPSf2/e4G3rpMp5vdyf/BNgAHgSTtgA/gfqAAAAAElFTkSuQmCC',
                width: 120,
                height: 79,
                offsetX: 60,
                offsetY: 70,
                opacity: 1,
                size: 1,
            },
            graySymbol: {
                source: 'data:image/png;base64,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',
                width: 34,
                height: 46,
                offsetX: 17,
                offsetY: 40,
                opacity: 1,
                size: 1,
            },
            grayStartSymbol: {
                source: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAuCAYAAABNhcu5AAAJeUlEQVRYhb2Ye4xU1R3HP/cxM/ue3Vlgp+gKFkV2RaLdBHBZLMhr6fLWlhhNTbRGRRMIaWtMq/VJQyOKVVtSG5qYVNs0WoNaCUjEKAg2A4qwrCJ1ZWGZfS8su3Pv3HvP6R/3MbOzw2uT9pfc3Ln3nHvO53x/5/x+54zSnEhwKVZbV6cAGhABCoAwoAOqV0UANpAGDMAEnOZEQl5K+8rFQGrr6lSv01KgHKjw7iUelA4oHoQBnAP6gT7vPgCkmxMJcckgtXV1w8qAEBAF4sAVs2bOrHno/vtXTrzqqiklJSVRTdNCiqIoAFJK6TiOde7cuTOtJ060vLRly1uf7t9/FGgHksAZwALyKnQ+EBUo8gC+/8j69StWLl26urS0NCal247Xf6ahnGeAgYGB3rfeeedvGzdtehv41gMawnXjRUE0XDdMaKivr9/49NNPRMvKxkl32IwAyQOAV8cvO3v2bOcjjz325Cd79+4FvgPOAs6FQFSgDLjmmccfv2/F0qU/k6BKIRBCIAEpxLBOspWQUmYgMlKhunXE2+++u/WJZ599FfgG11UBTADirYoSYNIfX3zxV7fMmnW7kBLHthFCYDsOwnEQniqqqqL4INkwHjAQlKuahqaqqKrK3v37316zbt0zwDHciSwhs/TAXRnfe27DhjWz6+tvF1IiHAfHcUin06RNE8M0KSwuprC4mFQqhWGamOk06XQay7vSloVpmphefTOdxjRNLMvCcRzqZ8xYsWnDhoeBK7w+CUA8l5T/5Lbb5jQuWHCv72dHCGzbdhtPpzEMgxunT+emGTMYSqUwDAPDMDBNk7RlZSC8zk3TxDAMdyCWhW3bOI7DvLlz777zjjvmAzHcOYnuARUA43+xbt0GRVFUISVCCITjYNk2lmVhmCbpdDqQzzAMNFVF0zRUTaNp1SouZAf372doYAAUBUVVlXVr1jz91zfe+BR34g7q3twoe+WFF+4rLiqqFEIghQjU0EMh4tXVOI6DbdtBw1OmTnX9r6r0dHXR292dmbBkgkW0vJxQKIRt21i2jabrSCEoiESiW7dseeieBx54FBjScYNWRf2MGXdJKd2V4c8PISgoKGDS5MkjRnj9tGnB76OHD/Phjh0ACMdxJ7YHtLCpibHjxuGr7DgOUteRUnLTtGk/BjYCPTpQsPbhh+sjkUhpMBofSAj6+/rYs3t34PvFS5cC8K9t21AUBV3XSQ0N4TgOCuAI4a4sIQJ18NoS3tL334bD4eKfr1s367nNm0+pQGTJokV3Z482UEVKTMOg/eRJ2k6c4ERra1Cn7bvvaGttpa21lTN9fdi2je2pKBzHjTvZIAyPM37Zwltv/SlQoAOhWCxWk/nCjRP+CGJjx1JUWoppmthOJhhWT5gAeNnOtplcU0MsFhuRSMorKka4NRtwTGXlDUBYB/RIOBzNqRnAzGhoGNEQwI+WLQt+dySTKIrC2KqqvHUBNwDmRGEpJeFwuBTQdEBRVVU/XwPftLQEMUBKSXz8eKricTqSSZLt7QAMnD3LtVOmAPDB++/Tcfo0iqKgaRrXTplCSWkpQ4ODw0G8S1NVDVB07zlP5nKt5fBhSqJRYmPGcOrkSQCq4nGS7e3s27MnqOeDAAghUDUNKSX/OXaMaDSKxI2ewVzJKKMAUsdNPCNgfGIhJePicWpvuGFYA+ez3BpSSiZMmsTkmhqOHjpEd0dHZkVJCYoiAVsHLCGEk+se6UdXbznm2jWTJxMfPx6AYy0twXs/0QV3RaGoqAgALRTKDMa7CyEswFIBw3ac/lwImTVhx3mT0HcNQHFJCVXxOFXxOGXRzFwPRyKBMn6ULisvB2Cgv3+EqrZt9wGGDhipVOpQOBS6NS8IEA67SbKsrCxo4IsDB9i3Zw+ql+YXNTUBcHNDA1Ouvz5QJxyJBKBDg4MjlB1MpRKAqQLWt62tfxgG4Unnu8ePBdPr6wMo3/y9xucHDjA4OEgoHGZcVRXjqqoYW1VFtLwcy7I4cujQ8JXj3Vu++upFwFKaEwlq6+qKv/zss3ZVVcv8tG8YBkNDQxSVltIwd+6IkXxx4AD/3rcPXdfRcmKEH8pVLzuHQiEi4TAFBQUUFhYSDocJh8Mo0HvjzTdfBQz6G6NUd0/P5uyO/Ml2RXW1S97cTF9vb1AeHz+eiVdfja5paFmXqqpouo6m66iq6parqqucpgUZWwE6urp+h3sEGbZVjHyxb18bMNbyNjmGYTB7/nz0UIi9H33EqbY2ptXVcV1NDaOxjvZ2jre0EAmHEXB6+uzZ1wApvDjiW7rl669X1Fx33ceqqqqaqhIKheju7CQai9Hd2UlI1zny+ee0Hj/OldXVFBUXE/VWhG/Za0IBdyMEKKpKZzKJ7qomDhw8uAr3NMgwRTxVtF3vvbc2Fottcmwb27bRQiFC4TDdnZ0jMuoFjxIQuEHTNHRdJ6Tr6LpOR1fX+qZVq17BPR0KyGwVfRPzmppe/nD79jHl0eijiqJgOw6pwUEKCwuDaJgnTI/g8YNZAOMB9Z05s6Fp1aotZCI6+UAA7LmNjb/5cPt2pyIa/bWiqplsnLUNDJ6z3ueDwQNRFYWunp6nGpcv/62nxLCPckH8QmduY+OTH+3YkY6Vlz+Vb/QyV5nz5SFXFdnZ1fXLxuXLX8qCuCDIMJgfLly44ZNdu4yKaHQjuUkxZ/d1AZPd3d0PLFq2bCvDj5nDPlPJbz6x0zBv3qa+/v71iqLIXL/7l3b+S/T09t41d/HiP+coMYL9fCDZJhrmz/99b1/fQxcf/DBzOjo7b5uzaNEb5Dn959pF/6jxrbauTv145857KmOxP3GBjRSAlNJuTyabFixZsvNS/zG6FEUAaE4kxOwFC7Z29/TcwwWUkVJabadOzbkciMsC8WFuWbjwtc6urjvJI7eU0jzR1jazcfnyvZcDcdkgPsycxsa/d3Z1rc6GkVKmjh0//oPFK1cevFyIUYFkwbx5Opm8HXCElANfHjkybcXq1UdHAwH548ilWmheU9MnLz///J27du/+5p/btvXjnqPTF/swn41Kkdq6Oh2oBKa+v3PnxNPJZAMwFaj0yi7bRqtIpPrKKye++frr/ygpLq4EODc42LNi9eol7adPn8UNXpdlo1IE0P+yZcsTPgRASXFx5WuvvvokoxzcaEGsioqKibkvvXfW/xPEtCzrg9yXlmXtImvX9T8HaU4knJlz5qy1LGs3XhKzbXv3vQ8+uLY5kXAu8nle+y+8g/QDW0ZlcQAAAABJRU5ErkJggg==',
                width: 53,
                height: 66,
                offsetX: 27,
                offsetY: 60,
                opacity: 1,
                size: 1,
            },
        },
        timeField: null,
        stateEventId: 'historytrack-state-change',
    },
    trackTool: null,
    carPolyline: null,
    animator: null, // 动画播放器
    slideParam: null, // 动画播放参数
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        //
    },
    /**
     * 注册播放的图标符号
     * @param symbolKey 符号key
     * @param symbol 符号参数
     */
    registSymbol(symbolKey: any, symbol: any) {
        this.options.symbolSet[symbolKey] = symbol;
    },
    /**
     * 加载
     * @param data 轨迹数据
     * @param symbolObj {Object}
     * @param timeField {String} 时间字段
     */
    load(data: any, symbolObj: any, timeField: any = 'time', show: any) {
        componentBase.prototype.load.call(this);
        this.options.timeField = timeField;
        this._createHisLayer();
        this._createHisAlLayer();
        const carPolyline = this._createPolyline(data);
        this.carPolyline = carPolyline;
        const carSymbol = this._getCarSymbol(symbolObj);
        // this.map.pan(carPolyline);
        // this.map.zoomTo(13);
        const center = {
            type: 'wkt',
            geom: 'POINT(' + data[0].longitude + ' ' + data[0].latitude + ')',
        };
        if (show) {
            this._addLayerAndSymbol(data, show);
        } else {
            this.options.featureLocate.fit(center, {
                maxZoom: 16,
            });
        }
        const trackLayerObj = this.map.findLayer(this.options.trackLayerId);
        // 创建一个动画播放器
        const animator = new g2.ani.Animator();
        animator.enable();
        animator.layer = trackLayerObj;
        this.animator = animator;
        trackLayerObj.clear();
        const self: any = this;
        this.onRunningListner = (id: any) => {
            this.options.paramId = id;
            const animation = animator.getAnimation(this.options.paramId).animation;
            animation.updated = (element: any, index: any) => {
                const polyline = animation.getInterLine();
                self._markCarRoute(polyline.copy(), index);
                const per = index / animation.count;
                self.fire('carTrackMoveEvent', { per });
            };
        };
        this.onFinishedListner = () => {
            self.options.playStatus = false;
            self.map.findLayer(self.options.hisAlLayerId).clear();
            self.map.findLayer(self.options.trackLayerId).clear();
            self._addLayerAndSymbol(data);
            trackLayerObj.add(new g2.sfs.Element({
                geometry: new g2.sfs.Point({ x: data[data.length - 1].longitude, y: data[data.length - 1].latitude, spatialReference: this.map.spatialReference }),
                symbol: carSymbol,
            }));
            // 触发播放完成的事件
            self.fire('finish', {});
        };
        animator.on('onRunning', this.onRunningListner);
        animator.on('onFinished', this.onFinishedListner);
        const projectService = new g2.sfs.CoordinateTransform();
        const measureService = new g2.sfs.MeasureService({projectService});
        const clength = (measureService.length(carPolyline) / 1000);
        let skip = 1;
        if (clength > 300) { // 距离超过300公里的历史轨迹
            skip = parseInt((clength / 300).toString(), 0) * 100;
        }
        const param = new g2.ani.PictureSlideParameter({
            geometry: carPolyline,
            img: carSymbol,
            speed: 300,
            skip,
            loop: false,
            isRotate: true,
        });
        this.slideParam = param;
        // 加载轨迹数据，地图叠加轨迹路线，视野调整
    },

    // 销毁
    destroy() {
        componentBase.prototype.destroy.call(this);
    },
    // 卸载
    unload() {
        if (this.isLoaded()) {
            this.options.playStatus = false;
            this.trackTool = null;
            this.animator.un('onRunning', this.onRunningListner);
            this.animator.un('onFinished', this.onFinishedListner);
            // 清除动画、清除地图轨迹线
            this.map.removeLayer(this.map.findLayer(this.options.trackLayerId));
            this.map.removeLayer(this.map.findLayer(this.options.hisLayerId));
            this.map.removeLayer(this.map.findLayer(this.options.hisAlLayerId));
            this.options.eventDispatcher.dispatch(this.options.stateEventId, {
                flag: this.options.playStatus,
            });
        }
        componentBase.prototype.unload.call(this);
    },
    // 播放或继续播放
    play(data: any) {
        return new Promise((res, rej) => {
            if (data.length > 1 && this.carPolyline.length() > 0) {
                if (!this.options.playStatus) {
                    this.finish();
                    this._addLayerAndSymbol(data);
                    this.animator.play(this.slideParam);
                } else {
                    this.animator.resume(this.options.paramId);
                }
                this.options.eventDispatcher.dispatch(this.options.stateEventId, {
                    flag: true,
                });
                res();
            } else {
                rej('暂无位移数据，无法播放轨迹动画！');
            }
        });

    },
    // 暂停
    pause() {
        //
        this.animator.pause(this.options.paramId);
        this.options.playStatus = true;
    },
    // 结束
    finish() {
        // todo
        this.animator.stop(this.options.paramId);
        //  this.trackTool.stop();
        this.options.playStatus = false;
        this.map.findLayer(this.options.trackLayerId).clear();
        this.map.findLayer(this.options.hisLayerId).clear();
        this.map.findLayer(this.options.hisAlLayerId).clear();
        this.options.eventDispatcher.dispatch(this.options.stateEventId, {
            flag: this.options.playStatus,
        });
    },
    // 添加线和起始点
    _addLayerAndSymbol(data: any, show: any) {
        let polylineSymbol = new g2.sfs.SimpleLineSymbol({
            width: 10,
            color: new g2.sfs.Color({ a: 255, r: 96, g: 255, b: 96 }),
        });
        if (show) {
            const polylineSymbol1 = new g2.sfs.SimpleLineSymbol({
                width: 8,
                color: new g2.sfs.Color({ a: 255, r: 204, g: 204, b: 204 }),
            });
            const polylineSymbol2 = new g2.sfs.SimpleLineSymbol({
                width: 10,
                color: new g2.sfs.Color({ a: 255, r: 121, g: 121, b: 121 }),
            });
            polylineSymbol = new (g2 as any).sfs.LineCombinedSymbol({
                lineSymbols: [ polylineSymbol2, polylineSymbol1 ],
            });
        }
        const hisLayer = this.map.findLayer(this.options.hisLayerId);
        hisLayer.clear();
        this.map.findLayer(this.options.trackLayerId).clear();
        const polyline = this._createPolyline(data);
        if (!show) {
            this.map.pan(polyline, [100, 100, 100, 100]);
        }
        this._markerStartEnd(data, show);
        hisLayer.add(new g2.sfs.Element({ geometry: polyline, symbol: polylineSymbol }));
    },
    _createHisLayer() {
        const hisLayer = new g2.carto.ElementLayer({
            id: this.options.hisLayerId,
            name: '轨迹播放图层',
            zIndex: 26,
        });
        const trackLayer = new g2.carto.ElementLayer({
            id: this.options.trackLayerId,
            name: '轨迹图层',
        });
        this.map.addLayer(hisLayer);
        this.map.addLayer(trackLayer);
    },
    _createHisAlLayer() {
        const hisAlLayer = new g2.carto.ElementLayer({
            id: this.options.hisAlLayerId,
            name: '轨迹已播放图层',
        });
        this.map.addLayer(hisAlLayer);
    },
    _markerStartEnd(pointArr: any, show: any) {
        const layer = this.map.findLayer(this.options.hisLayerId);
        if (!layer) {
            this._createHisLayer();
        }
        if (pointArr.length > 2) {
            const endPoint = new g2.sfs.Point({
                x: pointArr[pointArr.length - 1].longitude,
                y: pointArr[pointArr.length - 1].latitude,
                spatialReference: this.map.spatialReference,
            });
            const startPoint = new g2.sfs.Point({
                x: pointArr[0].longitude,
                y: pointArr[0].latitude,
                spatialReference: this.map.spatialReference,
            });
            const startpictureSymbol = new g2.sfs.PictureMarkerSymbol(this.options.symbolSet.startSymbol);
            const starttime = pointArr[pointArr.length - 1][this.options.timeField].split(' ');
            const starttextSymbol = new g2.sfs.TextSymbol({
                text: starttime[0] + '\r\n' + starttime[1],
                borderColor: new g2.sfs.Color({ alpha: 1, r: 255, g: 255, b: 255 }),
                borderThickness: 3,
                fontFamilyName: 'Impact',
                fontSize: 18,
                fontWeight: 700,
                foreground: new g2.sfs.Color({ r: 44, g: 165, b: 2, a: 255 }),
                offsetX: 0,
                offsetY: -45,
            });
            const endpictureSymbol = new g2.sfs.PictureMarkerSymbol(this.options.symbolSet.endSymbol);
            const endtime = pointArr[0][this.options.timeField].split(' ');
            const endtextSymbol = new g2.sfs.TextSymbol({
                text: endtime[0] + '\r\n' + endtime[1],
                borderColor: new g2.sfs.Color({ alpha: 1, r: 255, g: 255, b: 255 }),
                borderThickness: 3,
                fontSize: 18,
                fontWeight: 700,
                fontFamilyName: 'Impact',
                foreground: new g2.sfs.Color({ r: 242, g: 37, b: 37, a: 255 }),
                offsetX: 0,
                offsetY: -45,
            });
            let startCurSymbol = new g2.sfs.CurrencySymbol({
                textSymbol: starttextSymbol,
                markerSymbol: startpictureSymbol,
            });
            let endCurSymbol = new g2.sfs.CurrencySymbol({
                textSymbol: endtextSymbol,
                markerSymbol: endpictureSymbol,
            });

            if (show) {
                startCurSymbol = new g2.sfs.PictureMarkerSymbol(this.options.symbolSet.grayStartSymbol);
                endCurSymbol = new g2.sfs.PictureMarkerSymbol(this.options.symbolSet.graySymbol);
            }
            const startEle = new g2.sfs.Element({
                geometry: startPoint,
                symbol: startCurSymbol,
            });
            const endEle = new g2.sfs.Element({
                geometry: endPoint,
                symbol: endCurSymbol,
            });
            layer.add(startEle);
            if (!show) {
                layer.add(endEle);
            }
        }
    },
    _createPolyline(pointArr: any) {
        const polyline = new g2.sfs.Polyline({
            spatialReference: this.map.spatialReference,
        });
        const path = new g2.sfs.Path({
            spatialReference: this.map.spatialReference,
        });
        for (let i = pointArr.length - 1; i >= 0; --i) {
            const point = new g2.sfs.Point({
                x: pointArr[i].longitude * 1,
                y: pointArr[i].latitude * 1,
                spatialReference: this.map.spatialReference,
            });
            path.addPoint(point);
        }
        polyline.addGeometry(path);
        return polyline;
    },
    _getCarSymbol(symbol: any) {
        symbol = symbol || this.options.symbolSet.default;
        const pictureSymbol = new g2.sfs.PictureMarkerSymbol(symbol);
        return pictureSymbol;
    },
    // 标记消防车已经走过的路径
    _markCarRoute(carPolyline: any, index: any) {
        if (carPolyline) {
            const layer = this.map.findLayer(this.options.hisAlLayerId);
            if (!layer) {
                this._createHisAlLayer();
            }
            if (layer) {
                layer.clear();
            }
            const polyline1 = new g2.sfs.Polyline({
                spatialReference: this.map.spatialReference,
            });
            const path = new g2.sfs.Path({
                spatialReference: this.map.spatialReference,
            });
            for (let i = index; i >= 0; --i) {
                const indexPoint = carPolyline.getPoint(i);
                if (indexPoint) {
                    const point = new g2.sfs.Point({
                        x: indexPoint.copy().x,
                        y: indexPoint.copy().y,
                        spatialReference: this.map.spatialReference,
                    });
                    path.addPoint(point);
                }
            }
            polyline1.addGeometry(path);
            const lineSymbol = new g2.sfs.SimpleLineSymbol({
                width: 10,
                color: new g2.sfs.Color({ a: 255, r: 96, g: 96, b: 96 }),
            });
            layer.add(new g2.sfs.Element({ geometry: polyline1, symbol: lineSymbol }));
        }
    },
});
export default component;
