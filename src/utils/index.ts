/**
 * @description: 生成 uuid
 * @param {undefined}
 * @return {string} 生成的 uuid
 */
export function uuid (): string {
    const tempUrl = URL.createObjectURL(new Blob())
    const uuid = tempUrl.toString()
    URL.revokeObjectURL(tempUrl)
    return uuid.slice(-36)
}

/**
 * @description: 删除字符串中的指定字符
 * @param {string} 原始字符串
 * @param {Array<string | RegExp>} 要删除的匹配 字符|正则 数组
 * @param {?string} 是否使用字符切割返回的字符串
 * @return {string | Array<string>} 处理后的字符串
 */
export function replaceNull(string: string, payloads: Array<string | RegExp>): string;
// eslint-disable-next-line no-redeclare
export function replaceNull(string: string, payloads: Array<string | RegExp>, split: string): Array<string>;
// eslint-disable-next-line no-redeclare
export function replaceNull (string: string, payloads: Array<string | RegExp>, split?: string): Array<string> | string {
    payloads.forEach((payload) => {
        string = string.replace(payload, '')
    })
    return typeof split === 'string' ? string.split(split) : string
}

/**
 * @description: 生成表单枚举对象
 * @param {Array<Object>}
 * @param {string} label 字段
 * @param {string} value 字段
 * @return {Proxy} 生成的枚举对象
 */
export function makeEnum (arr: Array<any>, label?: string, value?: string): Array<{ label: string; value: string }> {
    arr = arr.map((e) => ({ label: e[label || 'label'], value: e[value || 'value'] }))
    return new Proxy(arr, {
        get (target, key) {
            if (key === 'label') {
                return (value: string) => arr.find((e) => e.value === value)?.label
            }
            if (key === 'value') {
                return (label: string) => arr.find((e) => e.label === label)?.value
            }
            return target[key as unknown as number]
        }
    })
}

/**
 * @description: 数字千位分割
 * @param {string | number}
 * @return {string}
 */
export function thousandthDot (text: string | number): string {
    if (isNaN(Number(text))) {
        return text.toString()
    } else {
        return Number(text).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    }
}
