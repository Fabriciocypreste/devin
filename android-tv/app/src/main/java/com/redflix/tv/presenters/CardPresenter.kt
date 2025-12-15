package com.redflix.tv.presenters

import android.view.ViewGroup
import androidx.leanback.widget.ImageCardView
import androidx.leanback.widget.Presenter
import com.bumptech.glide.Glide
import com.redflix.tv.R
import com.redflix.tv.models.Content

class CardPresenter : Presenter() {
    
    companion object {
        private const val CARD_WIDTH = 313
        private const val CARD_HEIGHT = 176
    }
    
    override fun onCreateViewHolder(parent: ViewGroup): ViewHolder {
        val cardView = ImageCardView(parent.context).apply {
            isFocusable = true
            isFocusableInTouchMode = true
            setBackgroundColor(parent.context.getColor(R.color.card_background))
        }
        return ViewHolder(cardView)
    }
    
    override fun onBindViewHolder(viewHolder: ViewHolder, item: Any) {
        val content = item as Content
        val cardView = viewHolder.view as ImageCardView
        
        cardView.titleText = content.title
        cardView.contentText = content.overview?.take(100) ?: ""
        cardView.setMainImageDimensions(CARD_WIDTH, CARD_HEIGHT)
        
        content.posterPath?.let { posterPath ->
            Glide.with(cardView.context)
                .load(posterPath)
                .centerCrop()
                .error(R.drawable.banner)
                .into(cardView.mainImageView)
        }
    }
    
    override fun onUnbindViewHolder(viewHolder: ViewHolder) {
        val cardView = viewHolder.view as ImageCardView
        cardView.badgeImage = null
        cardView.mainImage = null
    }
}
