// 快速排序

function quickSort(arr, left, right) {
	let len = arr.length,
		partitionIndex
		left = typeof left != 'number' ? 0 : left,
		right = typeof right != 'number' ? len - 1 : right
	if (left < right) {
		partitionIndex = partition(arr, left, right)
		quickSort(arr, left, partitionIndex - 1)
		quickSort(arr, partitionIndex + 1, right)
	}
	return arr
}

function partition(arr, left, right) {
	let pivot = left,
		index = pivot + 1
	for (let i = index; i <= right; i++) {
		if (arr[i].top < arr[pivot].top) {
			swap(arr, i, index)
			index ++
		} else if (arr[i].top === arr[pivot].top && arr[i].left < arr[pivot].left) {
			swap(arr, i, index)
			index ++
		}
	}
	swap(arr, pivot, index - 1)
	return index - 1
}

function swap(arr, i, j) {
	let temp = arr[i]
	arr[i] = arr[j]
	arr[j] = temp
}

module.exports = {
	quickSort
}