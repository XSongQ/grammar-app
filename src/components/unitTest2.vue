<template>
    <div>{{ analysisResult }}</div>

</template>


<script>
export default{
    props: {
        analysisResult: {
            type: String,
            required: true
        }
    }
}
</script>