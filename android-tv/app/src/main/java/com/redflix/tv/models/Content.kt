package com.redflix.tv.models

import java.io.Serializable

data class Content(
    val id: Int,
    val tmdbId: Int?,
    val title: String,
    val originalTitle: String?,
    val type: String,
    val overview: String?,
    val posterPath: String?,
    val backdropPath: String?,
    val logoPath: String?,
    val trailerUrl: String?,
    val streamUrl: String?,
    val releaseDate: String?,
    val runtime: Int?,
    val voteAverage: Float,
    val voteCount: Int,
    val genres: String?,
    val channelNumber: Int?,
    val isLive: Boolean
) : Serializable

data class Channel(
    val id: Int,
    val channelNumber: Int,
    val title: String,
    val logoPath: String?,
    val streamUrl: String
) : Serializable
